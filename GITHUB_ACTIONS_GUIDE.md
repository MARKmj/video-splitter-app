# 🚀 使用 GitHub Actions 自动打包 Windows exe（推荐方案）

这是获取 Windows exe **最简单、最可靠**的方法！

## ✨ 优势

- 🎯 **自动化**：推送代码后自动构建
- 🌍 **多平台**：同时生成 Windows 和 Mac 版本
- 📦 **标准化**：使用 GitHub 官方的构建环境
- 💰 **免费**：公开仓库完全免费
- 🚀 **快速**：通常 5-10 分钟完成构建

## 📝 步骤

### 1️⃣ 初始化 Git 仓库

```bash
cd video-splitter-app

# 如果还没有 .git 文件夹
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit: 视频分段工具"
```

### 2️⃣ 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（例如：`video-splitter-app`）
3. **不要**勾选 "Add a README file"（我们已经有了）
4. 点击 "Create repository"

### 3️⃣ 推送代码到 GitHub

```bash
# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/video-splitter-app.git

# 推送代码
git branch -M main
git push -u origin main
```

### 4️⃣ 创建版本标签并推送

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签（这会触发 GitHub Actions）
git push origin v1.0.0
```

### 5️⃣ 查看构建进度

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 你会看到 "Build and Release" 工作流正在运行

### 6️⃣ 下载打包好的文件

构建完成后（约 5-10 分钟）：

1. 访问仓库的 "Releases" 页面
2. 找到 "v1.0.0" 版本
3. 下载你需要的文件：
   - `视频分段工具 Setup 1.0.0.exe` - Windows 安装程序
   - `视频分段工具-1.0.0.dmg` - Mac 安装程序

## 🔄 手动触发构建

你也可以不创建标签，直接手动触发：

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Build and Release" 工作流
4. 点击 "Run workflow" 按钮
5. 选择分支并点击 "Run workflow"

## 📋 构建配置说明

项目已经包含了 GitHub Actions 配置文件：

**文件位置**：`.github/workflows/build.yml`

**配置内容**：
- ✅ 自动构建 Windows 和 Mac 版本
- ✅ 使用 Node.js 18
- ✅ 自动安装依赖
- ✅ 自动构建前端
- ✅ 自动打包 Electron 应用
- ✅ 自动创建 GitHub Release
- ✅ 自动上传构建产物

## 🎯 构建产物

每次构建会生成：

**Windows 版本**：
- `视频分段工具 Setup 1.0.0.exe` - 带安装向导的版本
- `视频分段工具 1.0.0.exe` - 便携版（未在 release 中，需从 artifacts 下载）

**Mac 版本**：
- `视频分段工具-1.0.0.dmg` - Mac 磁盘映像
- `视频分段工具-1.0.0-arm64.dmg` - Apple Silicon 版本

## 📦 版本管理

### 发布新版本

```bash
# 1. 修改版本号（如果需要）
# 编辑 package.json 中的 version 字段

# 2. 提交更改
git add .
git commit -m "Bump version to 1.0.1"

# 3. 推送到 GitHub
git push

# 4. 创建新标签
git tag v1.0.1
git push origin v1.0.1
```

### 查看所有标签

```bash
git tag
```

### 删除标签（如果出错）

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin :refs/tags/v1.0.0
```

## 🛠️ 故障排除

### 构建失败

1. 查看 "Actions" 标签下的日志
2. 常见问题：
   - **依赖安装失败**：检查 package.json
   - **构建超时**：可能需要优化代码或增加超时时间
   - **Windows 签名问题**：可以忽略，只是警告

### 文件未出现在 Release 中

- 检查 `.github/workflows/build.yml` 中的文件路径是否正确
- 确保 dist 文件夹中有生成的文件

## 🎉 成功标志

当一切正常时，你会看到：

1. ✅ Actions 页面显示绿色的 ✓
2. ✅ Releases 页面出现新版本
3. ✅ 可以下载 exe 和 dmg 文件

## 📱 分发给用户

直接分享 Release 链接：
```
https://github.com/你的用户名/video-splitter-app/releases/latest
```

用户可以：
- 查看 Release 说明
- 下载适合他们操作系统的版本
- 查看历史版本

## 💡 提示

- 首次构建可能需要更长时间（缓存未建立）
- 后续构建通常会更快（5-10 分钟）
- 可以构建多个架构（x64, arm64）
- Release 文件永久保存在 GitHub

---

**需要帮助？** 查看 [BUILD_WINDOWS_GUIDE.md](BUILD_WINDOWS_GUIDE.md) 了解其他打包方法。
