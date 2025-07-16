// students.js
const express = require('express');
const router = express.Router();

// 引入体验学生模型
const TrialStudent = require('../models/trialStudent');

// 体验学生添加接口
router.post('/trial', async (req, res) => {
  try {
    console.log('Received trial student creation request:', req.body);
    
    // 输入验证
    const { name, gender, grade, school, phone, teacher } = req.body;
    if (!name || !phone || !teacher) {
      return res.status(400).json({
        status: 'fail',
        message: '请提供必填字段: 姓名、电话、教师'
      });
    }
    
    // 创建体验学生记录
    const newTrialStudent = new TrialStudent({
      name,
      gender,
      grade,
      school,
      phone,
      score: req.body.score,
      date: req.body.date ? new Date(req.body.date) : undefined,
      teacher,
    });
    
    // 保存到数据库
    const savedStudent = await newTrialStudent.save();
    
    // 返回成功响应
    res.status(201).json({
      status: 'success',
      data: {
        student: savedStudent
      }
    });
  } catch (err) {
    console.error('Error creating trial student:', err);
    res.status(500).json({
      status: 'error',
      message: '创建体验学生记录时发生错误'
    });
  }
});

// 获取体验学生列表接口
router.get('/trial/list', async (req, res) => {
  try {
    console.log('Fetching trial students list');
    
    // 查询所有体验学生
    const students = await TrialStudent.find({});
    
    // 返回成功响应
    res.json({
      status: 'success',
      data: {
        students,
        total: students.length
      }
    });
  } catch (err) {
    console.error('Error fetching trial students:', err);
    res.status(500).json({
      status: 'error',
      message: '获取体验学生列表时发生错误'
    });
  }
});

module.exports = router;