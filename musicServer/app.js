const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
const port = 4000;

// 启用CORS，允许前端访问API
app.use(cors());

// 使用 JSON 数据格式
app.use(express.json());

// 配置API路由
app.use('/sql', apiRouter);

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});