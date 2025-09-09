#!/bin/bash

echo "🚀 启动AI功能网站..."

# 检查是否安装了必要的工具
if ! command -v java &> /dev/null; then
    echo "❌ 请先安装Java 17或更高版本"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ 请先安装Yarn"
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    echo "❌ 请先安装MySQL"
    exit 1
fi

echo "✅ 环境检查通过"

# 启动后端
echo "🔧 启动后端服务..."
cd backend
if [ ! -f "mvnw" ]; then
    echo "📥 下载Maven Wrapper..."
    mvn -N wrapper:wrapper
fi

# 检查数据库连接
echo "🔍 检查数据库连接..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ai_website;" 2>/dev/null

echo "🏗️ 编译并启动Spring Boot应用..."
./mvnw spring-boot:run &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 30

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    yarn install
fi

echo "🚀 启动React开发服务器..."
yarn start &
FRONTEND_PID=$!

echo "✅ AI功能网站启动完成！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 