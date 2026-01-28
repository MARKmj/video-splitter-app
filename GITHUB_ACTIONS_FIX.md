# 🔧 GitHub Actions 修复说明

## ❌ 问题说明

你遇到的错误是因为 GitHub Actions 配置文件使用了**已弃用的 actions 版本**：

```
This request has been automatically failed because it uses a deprecated version of
`actions/upload-artifact: v3`
```

## ✅ 已修复

我已经更新了 `.github/workflows/build.yml` 文件，修复了所有已弃用的 actions：

### 更新内容：

| Action | 旧版本 | 新版本 |
|--------|--------|--------|
| actions/checkout | v3 | **v4** |
| actions/setup-node | v3 | **v4** |
| actions/upload-artifact | v3 | **v4** |

### 额外优化：

- 添加了 `compression-level: 6` 参数，优化上传速度

## 🚀 下一步操作

修复已经提交到本地 Git，但需要推送到 GitHub。

### 方法 1：如果你能连接到 GitHub（推荐）

```bash
cd video-splitter-app

# 推送修复到 GitHub
git push origin main

# 删除失败的标签（如果有）
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# 重新创建标签
git tag v1.0.0
git push origin v1.0.0
```

### 方法 2：如果网络连接有问题

#### 方案 A：在 GitHub 网页上直接编辑

1. 访问你的 GitHub 仓库
2. 进入 `.github/workflows/build.yml` 文件
3. 点击铅笔图标（编辑）
4. 找到并替换以下内容：

```yaml
# 第 18 行
- uses: actions/checkout@v4  # 改为 v4

# 第 21 行
- uses: actions/setup-node@v4  # 改为 v4

# 第 37 行
- uses: actions/upload-artifact@v4  # 改为 v4
  with:
    name: ${{ matrix.os }}-build
    path: dist/*
    retention-days: 30
    compression-level: 6  # 添加这行
```

5. 点击 "Commit changes"

#### 方案 B：使用代理或 VPN

如果你在中国大陆，可能需要配置代理：

```bash
# 设置 Git 代理（如果你有代理）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 推送代码
git push origin main
git push origin v1.0.0

# 推送后取消代理（可选）
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### 方案 C：使用 SSH 代替 HTTPS

```bash
# 更改远程仓库 URL 为 SSH
git remote set-url origin git@github.com:MARKmj/video-splitter-app.git

# 推送代码
git push origin main
git push origin v1.0.0
```

## 📋 完整的修复后流程

### 1. 推送代码修复

选择上面任何一种方法推送修复。

### 2. 删除失败的标签和 Release

在 GitHub 网页上：
1. 访问仓库的 "Releases" 页面
2. 删除失败的 v1.0.0 Release（如果有）
3. 访问仓库的 "Tags" 页面
4. 删除失败的 v1.0.0 tag

### 3. 重新触发构建

```bash
# 本地删除标签
git tag -d v1.0.0

# 推送删除
git push origin :refs/tags/v1.0.0

# 重新创建标签
git tag v1.0.0

# 推送新标签
git push origin v1.0.0
```

### 4. 查看构建进度

访问：https://github.com/MARKmj/video-splitter-app/actions

这次应该能成功构建了！

## 🎯 验证修复成功

构建成功后，你会看到：

1. ✅ Actions 页面显示绿色的 ✓
2. ✅ 没有关于 "deprecated version" 的警告
3. ✅ Release 页面出现新的 v1.0.0
4. ✅ 可以下载 exe 和 dmg 文件

## 📝 修复后的完整配置

这是修复后的完整配置（供参考）：

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}

    steps:
    - name: Checkout code
      uses: actions/checkout@v4  # ✅ 已更新到 v4

    - name: Setup Node.js
      uses: actions/setup-node@v4  # ✅ 已更新到 v4
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
      uses: actions/upload-artifact@v4  # ✅ 已更新到 v4
      with:
        name: ${{ matrix.os }}-build
        path: dist/*
        retention-days: 30
        compression-level: 6  # ✅ 新增优化参数

    - name: Create Release
      if: matrix.os == 'windows-latest'
      uses: softprops/action-gh-release@v1
      with:
        files: |
          dist/*.exe
          dist/*.dmg
        draft: false
        prerelease: false
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 💡 总结

- ✅ 问题已识别：使用了已弃用的 actions v3
- ✅ 修复已完成：更新到 v4 并优化
- ⏳ 待操作：推送修复到 GitHub
- 🎯 预期结果：5-10 分钟后获得 Windows exe

选择上面的任何一种推送方法，然后重新触发构建即可！
