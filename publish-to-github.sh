#!/bin/bash

# 🚀 视频分段工具 - GitHub 发布脚本
# 这个脚本会帮助你初始化 Git 仓库并推送到 GitHub

set -e  # 遇到错误立即退出

echo "🎬 视频分段工具 - GitHub 发布助手"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否已安装 git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ 未检测到 Git！请先安装 Git。${NC}"
    echo "macOS: brew install git"
    echo "Windows: https://git-scm.com/download/win"
    exit 1
fi

# 检查是否已经在 git 仓库中
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  检测到已存在 Git 仓库${NC}"
    read -p "是否继续使用现有仓库？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "操作已取消"
        exit 0
    fi
else
    echo -e "${GREEN}✓ 初始化 Git 仓库...${NC}"
    git init
fi

# 询问 GitHub 用户名和仓库名
echo ""
read -p "请输入你的 GitHub 用户名: " github_username
read -p "请输入仓库名称 (默认: video-splitter-app): " repo_name
repo_name=${repo_name:-video-splitter-app}

# 创建 .gitignore（如果不存在）
if [ ! -f ".gitignore" ]; then
    echo -e "${GREEN}✓ 创建 .gitignore 文件...${NC}"
    cat > .gitignore << 'EOF'
node_modules/
build/
dist/
*.log
.DS_Store
.env
.env.local
EOF
fi

# 添加所有文件
echo -e "${GREEN}✓ 添加文件到 Git...${NC}"
git add .

# 检查是否有更改需要提交
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  没有新的更改需要提交${NC}"
else
    echo -e "${GREEN}✓ 创建初始提交...${NC}"
    git commit -m "Initial commit: 视频分段工具

✨ 主要功能:
- 批量视频分割
- 自定义分段时长 (1-999秒)
- 音频控制 (消除/保留声音)
- 10种视频比例支持
- 中心裁剪算法
- 精美 UI 设计

🔧 技术栈: React + Electron + FFmpeg"
fi

# 添加远程仓库
remote_url="https://github.com/${github_username}/${repo_name}.git"
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  检测到已存在远程仓库 origin${NC}"
    read -p "是否要更新远程仓库 URL？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "$remote_url"
        echo -e "${GREEN}✓ 远程仓库 URL 已更新${NC}"
    fi
else
    echo -e "${GREEN}✓ 添加远程仓库...${NC}"
    git remote add origin "$remote_url"
fi

# 创建 main 分支
echo -e "${GREEN}✓ 设置主分支为 main...${NC}"
git branch -M main

echo ""
echo "========================================"
echo -e "${GREEN}✅ Git 仓库初始化完成！${NC}"
echo "========================================"
echo ""
echo "📝 下一步操作："
echo ""
echo "1. 在 GitHub 上创建新仓库："
echo "   访问: https://github.com/new"
echo "   仓库名: ${repo_name}"
echo "   ⚠️  不要勾选 'Add a README file'"
echo ""
echo "2. 推送代码到 GitHub："
echo -e "${YELLOW}   git push -u origin main${NC}"
echo ""
echo "3. 创建版本标签并触发构建："
echo -e "${YELLOW}   git tag v1.0.0${NC}"
echo -e "${YELLOW}   git push origin v1.0.0${NC}"
echo ""
echo "4. 查看构建进度："
echo "   访问: https://github.com/${github_username}/${repo_name}/actions"
echo ""
echo "5. 下载打包好的文件："
echo "   访问: https://github.com/${github_username}/${repo_name}/releases"
echo ""
echo "========================================"
echo ""
echo -e "${YELLOW}💡 提示: 查看 GITHUB_ACTIONS_GUIDE.md 了解详细说明${NC}"
echo ""
