# 简易聊天应用

这是一个可以直接部署在GitHub上的跨网络聊天应用。该应用使用WebSocket进行实时通信，无需在同一局域网内即可使用。

## 功能特点
- 实时消息发送和接收
- 用户加入/离开通知
- 支持多个用户同时在线
- 简洁美观的界面
- 支持部署到GitHub Pages

## 技术栈
- 前端：HTML, CSS, JavaScript
- 后端：Python, FastAPI, WebSocket

## 本地运行
1. 克隆此仓库
2. 安装依赖：
   ```
   pip install -r requirements.txt
   ```
3. 运行服务器：
   ```
   python server.py
   ```
4. 在浏览器中打开 `http://localhost:8765`
5. 输入昵称开始聊天

## 部署到GitHub Pages
1. 将代码推送到GitHub仓库
2. 进入仓库设置，找到"Pages"选项
3. 选择分支（通常是main）和文件夹（选择root）
4. 点击"Save"按钮，等待部署完成
5. 部署完成后，您将获得一个GitHub Pages URL

## 部署到Vercel
Vercel是一个适合部署此聊天应用的平台，它提供了免费的serverless函数和静态网站托管服务。以下是详细步骤：

### 准备工作
1. 确保您的代码已推送到GitHub仓库
2. 创建Vercel账户：访问 <mcurl name="Vercel官网" url="https://vercel.com/signup"></mcurl> 并使用GitHub账号登录

### 部署步骤
1. 在Vercel控制台中点击"New Project"
2. 导入您的GitHub仓库
3. 项目配置：
   - 框架预设：选择"Other"
   - 构建命令：留空
   - 输出目录：留空
   - 安装命令：`pip install -r requirements.txt`
4. 点击"Deploy"按钮开始部署
5. 等待部署完成，Vercel会为您分配一个URL（如https://your-project.vercel.app）

### 配置WebSocket连接
1. 打开<mcfile name="script.js" path="g:\项目\script.js"></mcfile>文件
2. 将WebSocket连接地址修改为：
   ```javascript
   // 替换为您的Vercel项目URL
   socket = new WebSocket('wss://your-project.vercel.app/ws');
   ```
3. 将更改推送到GitHub，Vercel会自动重新部署

## 其他部署选项
如果您不想使用Vercel，也可以将后端代码部署到其他云服务提供商（如Heroku、AWS等）：
1. 将后端代码部署到您选择的云服务
2. 在<mcfile name="script.js" path="g:\项目\script.js"></mcfile>中修改WebSocket连接地址为您的服务器地址：
   ```javascript
   socket = new WebSocket('ws://您的服务器地址/ws');
   ```
3. 重新部署前端到GitHub Pages

## 注意事项
- 确保您的服务器支持WebSocket协议
- 对于生产环境，建议使用HTTPS和WSS协议以确保安全
- 本应用仅供学习和演示目的，在生产环境中使用时请考虑添加用户认证和消息持久化等功能

## 贡献
欢迎提交issues和pull requests来改进这个应用！