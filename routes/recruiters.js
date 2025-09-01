const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Recruiter = require('../models/recruiter');

// 创建招生老师
router.post('/create', [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('account').isLength({ min: 4, max: 20 }).withMessage('账号长度应在4-20个字符之间'),
  body('password').isLength({ min: 4 }).withMessage('密码长度至少4个字符'),
  body('sex').custom(value => ['男', '女', '其他'].includes(value)).withMessage('性别必须是男、女或其他'),
  body('phone').matches(/^\d{11}$/).withMessage('请输入有效的11位电话号码')
], async (req, res) => {
  // 验证
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, account, password, sex, phone } = req.body;

    // 检查账号是否已存在
    let recruiter = await Recruiter.findOne({ account });
    if (recruiter) {
      return res.status(400).json({ msg: '该账号已被注册' });
    }

    // 创建新招生老师
    recruiter = new Recruiter({
      name,
      account,
      password,
      sex,
      phone
    });

    await recruiter.save();

    res.status(201).json({
      msg: '招生老师创建成功',
      data: {
        id: recruiter._id,
        name: recruiter.name,
        account: recruiter.account,
        sex: recruiter.sex,
        phone: recruiter.phone,
        password: recruiter.password
      }
    });
  } catch (error) {
    console.error('创建招生老师失败:', error.message);
    res.status(500).send('服务器错误');
  }
});

// 获取所有招生老师信息
router.get('/', async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select('-password');
    res.json({
      count: recruiters.length,
      data: recruiters.map(recruiter => ({
        id: recruiter._id,
        name: recruiter.name,
        account: recruiter.account,
        sex: recruiter.sex,
        phone: recruiter.phone,
      }))
    });
  } catch (error) {
    console.error('获取招生老师信息失败:', error.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;