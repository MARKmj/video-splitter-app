const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// 视频尺寸映射表
const SIZE_MAP = {
  'original': null,
  '16:9': { width: 1920, height: 1080 },
  '16:9-720': { width: 1280, height: 720 },
  '4:3': { width: 1440, height: 1080 },
  '21:9': { width: 2560, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '9:16-720': { width: 720, height: 1280 },
  '4:5': { width: 1080, height: 1350 },
  '1:1': { width: 1080, height: 1080 },
  '1:1-720': { width: 720, height: 720 }
};

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    backgroundColor: '#0f172a',
    titleBarStyle: 'hiddenInset',
    frame: true
  });

  // 开发环境加载 localhost，生产环境加载打包后的文件
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // 开发环境打开 DevTools
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 选择文件夹
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 选择输出文件夹
ipcMain.handle('select-output-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// 获取文件夹中的视频文件
ipcMain.handle('get-video-files', async (event, folderPath) => {
  const files = fs.readdirSync(folderPath);
  const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm'];

  const videoFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return videoExtensions.includes(ext);
    })
    .map(file => ({
      name: file,
      path: path.join(folderPath, file),
      size: fs.statSync(path.join(folderPath, file)).size
    }));

  return videoFiles;
});

// 获取视频时长
ipcMain.handle('get-video-duration', async (event, videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
});

// 分割视频
ipcMain.handle('split-video', async (event, videoPath, outputPath, segmentDuration, onProgress) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(videoPath, path.extname(videoPath));
    const outputPattern = path.join(outputPath, `${fileName}_%02d${path.extname(videoPath)}`);

    ffmpeg(videoPath)
      .output(outputPattern)
      .outputOptions([
        '-c copy', // 使用 copy 编码，速度更快
        '-f segment', // 使用 segment 格式
        `-segment_time ${segmentDuration}`, // 每段时长
        '-reset_timestamps 1' // 重置时间戳
      ])
      .on('progress', (progress) => {
        if (onProgress) {
          onProgress(progress);
        }
      })
      .on('end', () => {
        resolve({ success: true });
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
});

// 批量分割视频
ipcMain.handle('batch-split-videos', async (event, videos, outputFolder, segmentDuration, removeAudio, videoSize) => {
  const results = [];
  const totalVideos = videos.length;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    mainWindow.webContents.send('split-progress', {
      current: i + 1,
      total: totalVideos,
      currentVideo: video.name,
      progress: 0
    });

    try {
      // 获取视频总时长
      const duration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(video.path, (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            resolve(metadata.format.duration);
          }
        });
      });

      const fileName = path.basename(video.path, path.extname(video.path));
      const numSegments = Math.ceil(duration / segmentDuration);

      // 循环处理每个片段
      for (let j = 0; j < numSegments; j++) {
        const startTime = j * segmentDuration;
        const segmentNumber = String(j + 1).padStart(2, '0');
        const outputFile = path.join(outputFolder, `${fileName}_${segmentNumber}${path.extname(video.path)}`);

        await new Promise((resolve, reject) => {
          let ffmpegCommand = ffmpeg(video.path)
            .seekInput(startTime)
            .duration(segmentDuration)
            .output(outputFile);

          // 根据尺寸和音频设置配置 FFmpeg
          const targetSize = SIZE_MAP[videoSize];

          if (targetSize) {
            // 需要调整尺寸 - 使用中心裁剪
            const targetWidth = targetSize.width;
            const targetHeight = targetSize.height;

            // 中心裁剪滤镜：先缩放到适应目标尺寸，然后居中裁剪
            const videoFilter = `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,crop=${targetWidth}:${targetHeight}`;

            if (removeAudio) {
              ffmpegCommand.outputOptions([
                '-vf', videoFilter,
                '-c:v libx264',
                '-preset ultrafast',
                '-crf 23',
                '-an'
              ]);
            } else {
              ffmpegCommand.outputOptions([
                '-vf', videoFilter,
                '-c:v libx264',
                '-c:a copy',
                '-preset ultrafast',
                '-crf 23'
              ]);
            }
          } else {
            // 原尺寸 - 使用 copy（快速）
            if (removeAudio) {
              ffmpegCommand.outputOptions([
                '-c:v copy',
                '-an'
              ]);
            } else {
              ffmpegCommand.outputOptions([
                '-c copy'
              ]);
            }
          }

          ffmpegCommand
            .on('progress', (progress) => {
              const totalProgress = Math.round(((j * 100) + (progress.percent || 0)) / numSegments);
              mainWindow.webContents.send('split-progress', {
                current: i + 1,
                total: totalVideos,
                currentVideo: video.name,
                progress: totalProgress
              });
            })
            .on('end', () => {
              resolve({ success: true, video: video.name, segment: segmentNumber });
            })
            .on('error', (err) => {
              reject({ error: err.message, video: video.name, segment: segmentNumber });
            })
            .run();
        });
      }

      results.push({ success: true, video: video.name });
    } catch (error) {
      results.push({ error: error.error || error.message, video: video.name });
    }
  }

  return results;
});
