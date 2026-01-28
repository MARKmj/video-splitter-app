# 视频分段工具

一个基于 Electron + React 开发的桌面应用，用于批量将视频文件按指定时长分段截断。

## 功能特点

- 🎬 支持批量处理多个视频文件
- ⚡ 使用 FFmpeg 快速分割视频
- 🎨 现代化的 UI 设计和流畅的交互体验
- 📊 实时显示处理进度
- ✅ 支持多种视频格式 (MP4, AVI, MOV, MKV, FLV, WMV, WEBM)

## 安装依赖

```bash
cd video-splitter-app
npm install
```

## 运行应用

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## 打包应用

```bash
npm run dist
```

打包后的应用将在 `dist` 目录中。

## 使用说明

1. 点击"选择文件夹"按钮选择包含视频文件的输入文件夹
2. 选择输出文件夹用于保存分割后的视频片段
3. 设置分段时长（可以拖动滑块或点击预设按钮）
4. 在视频列表中选择需要处理的视频
5. 点击"开始分段"按钮开始处理

## 系统要求

- Node.js 14+
- macOS 10.13+ / Windows 10+ / Linux
- FFmpeg（自动安装）

## 技术栈

- Electron: 桌面应用框架
- React: UI 库
- FFmpeg: 视频处理
- fluent-ffmpeg: FFmpeg Node.js 封装
