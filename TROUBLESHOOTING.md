# 问题修复指南

## 界面显示空白的问题

### 问题原因
1. Electron 环境变量未正确设置
2. React 开发服务器端口冲突
3. Electron API 调用错误

### 解决方案

#### 方案 1：使用提供的启动脚本（推荐）

```bash
./start.sh
```

这个脚本会自动：
- 清理端口冲突
- 启动 React 开发服务器
- 等待服务器就绪
- 启动 Electron 应用

#### 方案 2：手动分步启动

**步骤 1：清理端口**
```bash
lsof -ti:3000 | xargs kill -9
```

**步骤 2：启动 React 开发服务器**
```bash
npm run dev:renderer
```

等待看到 "Compiled successfully!" 消息。

**步骤 3：在新终端窗口启动 Electron**
```bash
cross-env ELECTRON_START_URL=http://localhost:3000 electron .
```

#### 方案 3：直接使用 npm 命令

```bash
npm run dev
```

### 检查是否成功启动

1. 打开浏览器访问 `http://localhost:3000`
2. 你应该能看到视频分段工具的界面
3. 如果看到界面，说明 React 运行正常
4. Electron 窗口会自动打开并加载相同内容

### 常见错误和解决方法

#### 错误 1：Something is already running on port 3000

**解决方法**：
```bash
lsof -ti:3000 | xargs kill -9
```

#### 错误 2：Cannot find module 'electron'

**解决方法**：
```bash
npm install
```

#### 错误 3：window.require is not a function

**解决方法**：这个已经在代码中修复，确保使用最新版本的 App.js

#### 错误 4：Electron 窗口打开但显示空白

**可能原因**：
- React 开发服务器未启动
- 环境变量未设置

**解决方法**：
```bash
# 确保先启动 React
npm run dev:renderer

# 等待启动完成后，在另一个终端运行
cross-env ELECTRON_START_URL=http://localhost:3000 electron .
```

### 开发者工具

如果 Electron 窗口打开，按以下快捷键打开开发者工具查看错误：
- **macOS**: Cmd + Option + I
- **Windows/Linux**: Ctrl + Shift + I

在控制台中查看是否有 JavaScript 错误。

### 完全重置

如果以上方法都不行，尝试完全重置：

```bash
# 1. 停止所有进程
lsof -ti:3000 | xargs kill -9

# 2. 清理依赖
rm -rf node_modules package-lock.json

# 3. 重新安装
npm install

# 4. 使用启动脚本
./start.sh
```

### 验证安装

运行以下命令检查依赖是否正确安装：

```bash
npm list electron react react-dom
```

应该看到已安装的版本号，没有错误信息。

### 获取帮助

如果问题仍然存在：
1. 检查 Node.js 版本：`node --version`（需要 14+）
2. 检查 npm 版本：`npm --version`
3. 尝试使用国内镜像安装：`npm install --registry=https://registry.npmmirror.com`
