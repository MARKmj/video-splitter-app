# 🎬 视频分段工具

一个功能强大的桌面应用程序，用于批量分割视频文件，支持自定义时长、音频控制和视频尺寸调整。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-lightgrey.svg)

## ✨ 主要功能

- 🎯 **批量分割**：一次处理多个视频文件
- ⏱️ **灵活时长**：支持 1-60 秒预设 + 自定义时长（1-999 秒）
- 🔊 **音频控制**：可选择是否消除音频
- 📐 **尺寸调整**：10 种标准视频比例
  - 原尺寸保持
  - 横屏：16:9, 4:3, 21:9
  - 竖屏：9:16, 4:5（适合抖音、快手、Instagram）
  - 正方形：1:1
- ✂️ **智能裁剪**：中心裁剪，无黑边，保持原比例
- 🎨 **精美界面**：现代化紫色渐变 UI 设计

## 🚀 快速开始

### 下载安装

**方法 1：从 GitHub Releases 下载（推荐）**

访问 [Releases 页面](../../releases/latest) 下载适合你操作系统的安装包：
- Windows：`视频分段工具 Setup 1.0.0.exe`
- macOS：`视频分段工具-1.0.0.dmg`

**方法 2：从源代码构建**

如果你是开发者，可以自己构建：

```bash
# 克隆仓库
git clone https://github.com/你的用户名/video-splitter-app.git
cd video-splitter-app

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 或构建生产版本
npm run build
npm start
```

详细构建说明请查看：
- [GitHub Actions 自动构建指南](GITHUB_ACTIONS_GUIDE.md) - 推荐！
- [Windows 打包指南](BUILD_WINDOWS_GUIDE.md)

## 📖 使用说明

### 基本操作

1. **选择输入文件夹**
   - 点击"选择输入文件夹"按钮
   - 选择包含视频文件的文件夹

2. **选择输出文件夹**
   - 点击"选择输出文件夹"按钮
   - 选择保存分割后视频的位置

3. **配置分割选项**
   - 调整分段时长（使用滑块或预设按钮）
   - 选择是否消除音频
   - 选择视频尺寸（可选）

4. **开始处理**
   - 点击"开始处理"按钮
   - 等待处理完成
   - 查看输出文件夹中的结果

### 功能说明

#### 分段时长

- **滑块控制**：1-60 秒
- **自定义输入**：1-999 秒
- **快速预设**：10、20、30、45、60 秒

#### 音频选项

- 🔊 **保留音频**：输出视频包含原始声音
- 🔇 **消除声音**：输出视频为静音模式

#### 视频尺寸

| 比例 | 分辨率 | 适用场景 |
|------|--------|----------|
| 原尺寸 | 保持不变 | 保持原始质量 |
| 16:9 | 1920x1080 / 1280x720 | YouTube、B站、横屏视频 |
| 9:16 | 1080x1920 / 720x1280 | 抖音、快手、竖屏短视频 |
| 1:1 | 1080x1080 / 720x720 | Instagram、朋友圈 |
| 4:5 | 1080x1350 | Instagram 专业模式 |
| 4:3 | 1440x1080 | 传统电视、老视频 |
| 21:9 | 2560x1080 | 超宽屏电影 |

## 🔧 技术架构

- **前端**：React 18 + CSS3
- **后端**：Electron 27
- **视频处理**：FFmpeg (fluent-ffmpeg)
- **构建工具**：electron-builder

## 📁 项目结构

```
video-splitter-app/
├── src/
│   ├── App.js              # React 主组件
│   ├── App.css             # 样式文件
│   └── electron/
│       └── index.js        # Electron 主进程
├── public/                 # 静态资源
├── build/                  # 构建输出（自动生成）
├── dist/                   # 打包输出（自动生成）
└── package.json            # 项目配置
```

## 🎯 核心算法

### 手动分段方案

项目使用手动分段方式，解决了 FFmpeg `-f segment` 与复杂滤镜不兼容的问题：

```javascript
// 1. 获取视频总时长
const duration = await getVideoDuration(videoPath);

// 2. 计算分段数量
const numSegments = Math.ceil(duration / segmentDuration);

// 3. 逐段处理
for (let i = 0; i < numSegments; i++) {
  const startTime = i * segmentDuration;

  ffmpeg(videoPath)
    .seekInput(startTime)      // 跳转到开始时间
    .duration(segmentDuration)   // 设置片段时长
    .output(outputFile)
    .run();
}
```

### 中心裁剪算法

```javascript
// 缩放到适合目标尺寸，然后裁剪中心
const videoFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,crop=${width}:${height}`;
```

**特点**：
- ✅ 保持原始纵横比
- ✅ 中心裁剪
- ✅ 无黑边
- ✅ 最大范围

## 📋 系统要求

### Windows
- Windows 10 或更高版本
- 64 位系统

### macOS
- macOS 10.15 (Catalina) 或更高版本
- 支持 Intel 和 Apple Silicon

### 通用要求
- 至少 2GB 可用内存
- 足够的磁盘空间（取决于视频大小）

## 🐛 故障排除

### 常见问题

**Q: 处理失败怎么办？**
- 检查输入文件是否是有效的视频格式
- 确保有足够的磁盘空间
- 查看控制台日志获取详细错误信息

**Q: 处理速度很慢？**
- 原尺寸模式使用 `-c copy`，速度最快
- 调整尺寸需要重新编码，速度较慢
- 可以调整 FFmpeg 预设（已设置为 ultrafast）

**Q: 输出视频有黑边？**
- 确保选择了合适的视频比例
- 项目使用中心裁剪算法，不应该出现黑边
- 如仍有问题，请提交 Issue

## 📝 更新日志

### v1.0.0 (2024-01-28)

- ✨ 初始发布
- ✅ 批量视频分割
- ✅ 自定义分段时长
- ✅ 音频控制
- ✅ 10 种视频比例支持
- ✅ 中心裁剪算法
- ✅ 精美 UI 设计

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [FFmpeg](https://ffmpeg.org/)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)

## 📧 联系方式

如有问题或建议，请：
- 提交 [Issue](../../issues)
- 发送 [Pull Request](../../pulls)

---

⭐ 如果这个项目对你有帮助，请给个 Star！
