require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 路由前缀中间件
app.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 引入User模型
const User = require('./models/user');

// 引入bcrypt
const bcrypt = require('bcryptjs');

// 引入路由模块
const authRoutes = require('./routes/auth');
const studentsRouter = require('./routes/students');
// 添加招生老师路由
const recruitersRouter = require('./routes/recruiters');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRouter);
// 添加招生老师API路由
app.use('/api/recruiters', recruitersRouter);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Vue-end API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
