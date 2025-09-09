# AI功能网站 - 快速启动指南

## 🚀 一键启动

```bash
./start.sh
```

## 📋 环境要求

- **Java 17+** - 运行Spring Boot后端
- **Node.js 16+** - 运行React前端
- **MySQL 8.0+** - 数据库服务

## 🔧 手动启动

### 1. 启动后端

```bash
cd backend
./mvnw spring-boot:run
```

### 2. 启动前端

```bash
cd frontend
yarn install
yarn start
```

## 🌐 访问地址

- **前端**: http://localhost:3000
- **后端API**: http://localhost:8080

## 📝 默认账户

- **用户名**: admin
- **密码**: admin

## 🎯 功能特性

### 用户系统
- ✅ 用户注册登录
- ✅ 个人中心管理
- ✅ JWT认证

### 积分系统
- ✅ 积分消耗机制
- ✅ 积分余额显示
- ✅ 充值功能（开发中）

### AI功能
- ✅ 智能对话
- ✅ 文本生成
- ✅ 图像识别
- ✅ 语音转文字
- ✅ 代码生成
- ✅ 文档总结

### 界面设计
- ✅ 高端科技风格
- ✅ 扁平化设计
- ✅ 响应式布局
- ✅ 玻璃态效果

## 🔧 配置说明

### 数据库配置
编辑 `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_website
    username: root
    password: your_password
```

### AI API配置
编辑 `backend/src/main/resources/application.yml`:
```yaml
ai:
  openai:
    api-key: your-openai-api-key
```

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查找占用端口的进程
lsof -i :8080
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 2. 数据库连接失败
- 确保MySQL服务正在运行
- 检查数据库用户名和密码
- 确保数据库 `ai_website` 已创建

### 3. 前端依赖安装失败
```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

## 📞 技术支持

如有问题，请检查：
1. 环境要求是否满足
2. 数据库配置是否正确
3. 端口是否被占用
4. 网络连接是否正常

---

**AI功能平台** - 高端科技，智能未来 🚀 