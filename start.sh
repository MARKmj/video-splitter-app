#!/bin/bash

echo "🎬 视频分段工具启动脚本"
echo "===================="

# 检查端口 3000 是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  端口 3000 已被占用，正在清理..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

echo "🚀 启动 React 开发服务器..."
npm run dev:renderer &

# 等待 React 服务器启动
echo "⏳ 等待 React 服务器启动..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ React 服务器已启动！"
        break
    fi
    echo "等待中... ($i/30)"
    sleep 1
done

echo "🎯 启动 Electron 应用..."
cross-env ELECTRON_START_URL=http://localhost:3000 electron .

echo "📝 提示：按 Ctrl+C 退出应用"
