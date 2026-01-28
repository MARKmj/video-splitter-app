# 🪟 Windows exe 打包指南

## 📋 前提条件

您的项目已经完全配置好，包含以下功能：
- ✅ 视频分段（手动分段方案，支持复杂滤镜）
- ✅ 音频控制（可选择是否消除声音）
- ✅ 视频尺寸标准化（10种比例选项）
- ✅ 中心裁剪，无黑边
- ✅ 精美的 UI 界面

## 🚀 在 Windows 机器上打包的方法

### 方法 1：在 Windows 机器上直接打包（推荐）

由于您在 macOS 上，打包 Windows exe 最可靠的方法是在 Windows 机器上进行。

#### 步骤：

1. **复制项目到 Windows 机器**
   ```bash
   # 将整个 video-splitter-app 文件夹复制到 Windows 电脑
   ```

2. **在 Windows 上安装 Node.js**
   - 下载并安装：https://nodejs.org/ (推荐 LTS 版本)

3. **安装依赖**
   ```bash
   cd video-splitter-app
   npm install
   ```

4. **构建前端**
   ```bash
   npm run build
   ```

5. **打包 Windows exe**
   ```bash
   npm run dist
   ```

   打包完成后，你会在 `dist` 文件夹中找到：
   - `视频分段工具 Setup 1.0.0.exe` - 安装程序
   - `视频分段工具 1.0.0.exe` - 便携版（无需安装）

### 方法 2：使用 GitHub Actions 自动构建（最简单）

创建 GitHub 仓库，使用 GitHub Actions 自动构建 Windows、Mac 和 Linux 版本。

#### 步骤：

1. **创建 GitHub 仓库并推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/video-splitter-app.git
   git push -u origin main
   ```

2. **创建 GitHub Actions 工作流**

   在项目根目录创建 `.github/workflows/build.yml`：

   ```yaml
   name: Build Release

   on:
     push:
       tags:
         - 'v*'

   jobs:
     build:
       strategy:
         matrix:
           os: [windows-latest, macos-latest, linux-latest]
       runs-on: ${{ matrix.os }}

       steps:
       - uses: actions/checkout@v3

       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'

       - name: Install dependencies
         run: npm install

       - name: Build frontend
         run: npm run build

       - name: Build Electron app
         run: npm run dist
         env:
           GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

       - name: Upload artifacts
         uses: actions/upload-artifact@v3
         with:
           name: ${{ matrix.os }}-build
           path: dist/*
   ```

3. **触发构建**
   ```bash
   git tag v1.0.0
   git push --tags
   ```

   GitHub Actions 会自动构建所有平台的版本！

### 方法 3：使用 Wine 在 macOS 上打包（不推荐）

理论上可以使用 Wine 在 Mac 上打包 Windows exe，但配置复杂且容易出错。

## 📦 打包配置说明

项目已经配置好 `package.json` 中的 `build` 字段：

```json
{
  "build": {
    "appId": "com.videosplitter.app",
    "productName": "视频分段工具",
    "win": {
      "target": [
        { "target": "nsis", "arch": ["x64"] },
        { "target": "portable", "arch": ["x64"] }
      ]
    }
  }
}
```

这会生成两种版本：
1. **NSIS 安装程序**：标准安装向导，用户可以选择安装路径
2. **便携版**：单个 exe 文件，双击即可运行

## 🔧 打包命令说明

```bash
# 仅构建前端（已成功 ✅）
npm run build

# 打包但不创建安装包（用于测试）
npm run pack

# 打包创建安装包（发布版本）
npm run dist

# 仅打包 Windows 版本
npm run dist -- --win

# 仅打包 64 位 Windows
npm run dist -- --win --x64
```

## ⚠️ 当前已知问题

1. **macOS 上的 Electron 安装问题**
   - 在您的 macOS 环境中，npm 安装 electron 时遇到文件锁定问题
   - 这可能是因为有其他 npm 进程在运行
   - 解决方案：在 Windows 机器上打包更可靠

2. **跨平台打包的限制**
   - macOS 无法直接打包 Windows exe（需要 Wine 或虚拟机）
   - Windows 无法直接打包 Mac .app（需要 Mac 电脑）
   - Linux 可以打包两者，但需要额外配置

## 📝 打包后的文件结构

```
dist/
├── 视频分段工具 Setup 1.0.0.exe         # Windows 安装程序
├── 视频分段工具 1.0.0.exe                # Windows 便携版
├── builder-effective-config.yaml         # 构建配置（调试用）
├── builder-debug.yml                     # 调试日志
└── ...
```

## 🎯 下一步建议

**推荐方案**：使用 **方法 2 (GitHub Actions)**

这是最简单、最可靠的方法：
- ✅ 自动构建所有平台（Windows、Mac、Linux）
- ✅ 不需要本地配置复杂的打包环境
- ✅ 可以自动发布版本
- ✅ 用户可以直接从 GitHub Releases 下载

如果需要帮助设置 GitHub Actions，请告诉我！
