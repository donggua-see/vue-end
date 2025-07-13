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

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 引入User模型
const User = require('./models/user');

// 登录路由
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username }).select('+password');
    
    // 如果用户不存在或密码不匹配
    if (!user || user.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }
    
    // 这里应该添加JWT生成逻辑或其他身份验证机制
    // 为了简单起见，我们暂时只返回用户信息
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

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