// auth.js
const express = require('express');
const router = express.Router();

// 登录路由
router.post('/login', async (req, res) => {
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

// 注册路由
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    
    const { username, password, usertype } = req.body;
    
    // 输入验证
    if (!username || !password || !usertype) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields'
      });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      $or: [{ username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Username already exists'
      });
    }
    
    // 创建新用户
    const newUser = new User({
      username,
      password,
      usertype
    });
    
    const user = await newUser.save();
    if (!user) {
      return res.status(500).json({
        status: 'error',
        message: 'User registration failed'
      });
    }
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;