import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 视频尺寸选项配置
  const sizeOptions = [
    { category: 'original', label: '原尺寸', ratio: '原尺寸', resolution: '保持不变', value: 'original' },
    { category: 'landscape', label: '16:9', ratio: '16:9', resolution: '1920x1080', value: '16:9', desc: 'Full HD' },
    { category: 'landscape', label: '16:9', ratio: '16:9', resolution: '1280x720', value: '16:9-720', desc: 'HD' },
    { category: 'landscape', label: '4:3', ratio: '4:3', resolution: '1440x1080', value: '4:3', desc: '传统' },
    { category: 'landscape', label: '21:9', ratio: '21:9', resolution: '2560x1080', value: '21:9', desc: '超宽' },
    { category: 'portrait', label: '9:16', ratio: '9:16', resolution: '1080x1920', value: '9:16', desc: '短视频' },
    { category: 'portrait', label: '9:16', ratio: '9:16', resolution: '720x1280', value: '9:16-720', desc: '移动端' },
    { category: 'portrait', label: '4:5', ratio: '4:5', resolution: '1080x1350', value: '4:5', desc: 'Instagram' },
    { category: 'square', label: '1:1', ratio: '1:1', resolution: '1080x1080', value: '1:1', desc: '标准' },
    { category: 'square', label: '1:1', ratio: '1:1', resolution: '720x720', value: '1:1-720', desc: '小尺寸' },
  ];

  // 安全地获取 ipcRenderer
  const getIpcRenderer = () => {
    try {
      return window.require('electron').ipcRenderer;
    } catch (error) {
      return null;
    }
  };

  const ipcRenderer = getIpcRenderer();
  const [inputFolder, setInputFolder] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [videos, setVideos] = useState([]);
  const [segmentDuration, setSegmentDuration] = useState(60);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [videoSize, setVideoSize] = useState('original');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentVideo: '', progress: 0 });
  const [results, setResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(new Set());

  // 监听处理进度
  useEffect(() => {
    if (!ipcRenderer) return;

    ipcRenderer.on('split-progress', (event, data) => {
      setProgress(data);
    });

    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('split-progress');
      }
    };
  }, []);

  // 选择输入文件夹
  const selectInputFolder = async () => {
    if (!ipcRenderer) {
      alert('此功能需要在 Electron 应用中使用');
      return;
    }
    const folder = await ipcRenderer.invoke('select-folder');
    if (folder) {
      setInputFolder(folder);
      const videoFiles = await ipcRenderer.invoke('get-video-files', folder);
      setVideos(videoFiles);
      setSelectedVideos(new Set(videoFiles.map(v => v.path)));
    }
  };

  // 选择输出文件夹
  const selectOutputFolder = async () => {
    if (!ipcRenderer) {
      alert('此功能需要在 Electron 应用中使用');
      return;
    }
    const folder = await ipcRenderer.invoke('select-output-folder');
    if (folder) {
      setOutputFolder(folder);
    }
  };

  // 切换视频选择状态
  const toggleVideoSelection = (videoPath) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoPath)) {
      newSelected.delete(videoPath);
    } else {
      newSelected.add(videoPath);
    }
    setSelectedVideos(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map(v => v.path)));
    }
  };

  // 开始处理
  const startProcessing = async () => {
    if (!ipcRenderer) {
      alert('此功能需要在 Electron 应用中使用');
      return;
    }
    if (!inputFolder || !outputFolder || selectedVideos.size === 0) {
      alert('请选择输入文件夹、输出文件夹和至少一个视频文件');
      return;
    }

    const selectedVideosList = videos.filter(v => selectedVideos.has(v.path));
    setIsProcessing(true);
    setResults([]);

    try {
      const result = await ipcRenderer.invoke(
        'batch-split-videos',
        selectedVideosList,
        outputFolder,
        segmentDuration,
        removeAudio,
        videoSize
      );
      setResults(result);
      setIsProcessing(false);
      alert(`处理完成！成功 ${result.filter(r => r.success).length} 个，失败 ${result.filter(r => r.error).length} 个`);
    } catch (error) {
      alert('处理出错: ' + error.message);
      setIsProcessing(false);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <div className="title">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)" />
              <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white" opacity="0.9" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#667eea" />
                  <stop offset="1" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            <h1>视频分段工具</h1>
          </div>
          <p className="subtitle">快速将长视频分割成多个短视频片段</p>
        </div>
      </div>

      <div className="container">
        <div className="config-section">
          <h2>配置选项</h2>

          <div className="config-grid">
            <div className="config-item">
              <label>输入文件夹</label>
              <div className="folder-selector">
                <input
                  type="text"
                  value={inputFolder}
                  readOnly
                  placeholder="选择包含视频的文件夹"
                />
                <button onClick={selectInputFolder} className="button-primary">
                  选择文件夹
                </button>
              </div>
            </div>

            <div className="config-item">
              <label>输出文件夹</label>
              <div className="folder-selector">
                <input
                  type="text"
                  value={outputFolder}
                  readOnly
                  placeholder="选择输出文件夹"
                />
                <button onClick={selectOutputFolder} className="button-primary">
                  选择文件夹
                </button>
              </div>
            </div>

            <div className="config-item">
              <label>分段时长（秒）</label>
              <div className="duration-selector">
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={segmentDuration}
                  onChange={(e) => setSegmentDuration(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="duration-value">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={segmentDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > 0) {
                        setSegmentDuration(val);
                      }
                    }}
                    className="number-input"
                  />
                  <span>秒</span>
                </div>
              </div>
              <div className="duration-presets">
                {[10, 20, 30, 45, 60].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSegmentDuration(duration)}
                    className={`preset-button ${segmentDuration === duration ? 'active' : ''}`}
                  >
                    {duration}秒
                  </button>
                ))}
              </div>
            </div>

            <div className="config-item">
              <label>音频选项</label>
              <div className="audio-toggle">
                <span className="toggle-label">消除声音</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={removeAudio}
                    onChange={(e) => setRemoveAudio(e.target.checked)}
                    className="toggle-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </label>
                {removeAudio && (
                  <span className="toggle-status">静音模式</span>
                )}
              </div>
            </div>

            <div className="config-item">
              <label>视频尺寸</label>
              <div className="size-selector-container">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVideoSize(option.value)}
                    className={`size-option-button ${videoSize === option.value ? 'active' : ''}`}
                  >
                    <div className="size-ratio">{option.ratio}</div>
                    <div className="size-resolution">{option.resolution}</div>
                    <div className="size-category">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {videos.length > 0 && (
          <div className="videos-section">
            <div className="videos-header">
              <h2>视频列表</h2>
              <div className="select-controls">
                <button onClick={toggleSelectAll} className="button-secondary">
                  {selectedVideos.size === videos.length ? '取消全选' : '全选'}
                </button>
                <span className="selected-count">
                  已选择 {selectedVideos.size} / {videos.length} 个视频
                </span>
              </div>
            </div>

            <div className="videos-list">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className={`video-item ${selectedVideos.has(video.path) ? 'selected' : ''}`}
                  onClick={() => toggleVideoSelection(video.path)}
                >
                  <div className="video-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedVideos.has(video.path)}
                      onChange={() => toggleVideoSelection(video.path)}
                    />
                  </div>
                  <div className="video-icon">🎬</div>
                  <div className="video-info">
                    <div className="video-name">{video.name}</div>
                    <div className="video-size">{formatFileSize(video.size)}</div>
                  </div>
                  <div className="video-status">
                    {selectedVideos.has(video.path) && (
                      <span className="status-badge">待处理</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="progress-section">
            <h2>处理进度</h2>
            <div className="progress-container">
              <div className="progress-info">
                <div className="progress-text">
                  正在处理: {progress.currentVideo}
                </div>
                <div className="progress-count">
                  {progress.current} / {progress.total}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <div className="progress-percentage">
                {progress.progress}%
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-section">
            <h2>处理结果</h2>
            <div className="results-list">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`result-item ${result.success ? 'success' : 'error'}`}
                >
                  <div className="result-icon">
                    {result.success ? '✓' : '✗'}
                  </div>
                  <div className="result-info">
                    <div className="result-video">{result.video}</div>
                    {result.error && (
                      <div className="result-error">{result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="action-section">
          <button
            onClick={startProcessing}
            disabled={isProcessing || selectedVideos.size === 0}
            className={`button-large ${isProcessing ? 'processing' : ''}`}
          >
            {isProcessing ? '处理中...' : '开始分段'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
