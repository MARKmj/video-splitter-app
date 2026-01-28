# 🚀 快速入门 - 获取 Windows exe

## 🎯 三种方法，任选其一

### 方法 1️⃣：使用 GitHub Actions（⭐ 强烈推荐）

**最简单、最可靠，5分钟搞定！**

```bash
cd video-splitter-app

# 运行发布脚本
./publish-to-github.sh

# 按照脚本提示操作：
# 1. 在 GitHub 创建新仓库
# 2. 推送代码：git push -u origin main
# 3. 创建标签：git tag v1.0.0 && git push origin v1.0.0

# 等待 5-10 分钟，然后在 GitHub Releases 下载 exe
```

详细说明：[GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)

---

### 方法 2️⃣：在 Windows 机器上打包

**如果你有 Windows 电脑，这是最直接的方法**

```bash
# 1. 将 video-splitter-app 文件夹复制到 Windows 电脑

# 2. 在 Windows 上安装 Node.js
# 访问: https://nodejs.org/

# 3. 在项目文件夹中打开命令提示符
cd video-splitter-app

# 4. 安装依赖
npm install

# 5. 构建
npm run build

# 6. 打包 exe
npm run dist

# 7. 在 dist 文件夹中找到 exe 文件
```

详细说明：[BUILD_WINDOWS_GUIDE.md](BUILD_WINDOWS_GUIDE.md)

---

### 方法 3️⃣：使用 Cross-Compile（不推荐）

**在 Mac 上使用 Wine 或虚拟机打包 Windows exe**

配置复杂，容易出错，不推荐。

---

## ✅ 推荐流程

**如果你想要最快速、最简单的方式：**

1. 使用 **方法 1（GitHub Actions）**
2. 运行 `publish-to-github.sh` 脚本
3. 按提示操作
4. 等待 5-10 分钟
5. 从 GitHub Releases 下载 exe

**好处：**
- ✅ 自动构建 Windows 和 Mac 版本
- ✅ 不需要本地配置复杂环境
- ✅ 可以直接分享链接给其他人下载
- ✅ 后续更新只需推送新标签

---

## 📦 文件说明

项目根目录下的重要文件：

- **[GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)** - GitHub Actions 详细使用指南
- **[BUILD_WINDOWS_GUIDE.md](BUILD_WINDOWS_GUIDE.md)** - 本地打包 Windows exe 指南
- **[README_CN.md](README_CN.md)** - 项目完整说明（中文）
- **[publish-to-github.sh](publish-to-github.sh)** - 自动发布脚本
- **[.github/workflows/build.yml](.github/workflows/build.yml)** - GitHub Actions 配置

---

## 🎉 开始使用

选择方法 1，运行脚本：

```bash
./publish-to-github.sh
```

按照提示操作，5分钟后你就能获得 Windows exe 安装包！

---

**需要帮助？** 查看：
- [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md) - GitHub Actions 详细说明
- [BUILD_WINDOWS_GUIDE.md](BUILD_WINDOWS_GUIDE.md) - 本地打包说明
- [README_CN.md](README_CN.md) - 项目功能说明

---

⏱️ **预计时间**：使用 GitHub Actions，从开始到获得 exe，只需 **5-10 分钟**！
