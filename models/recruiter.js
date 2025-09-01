const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RecruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名是必填项'],
    trim: true,
    maxlength: [50, '姓名长度不能超过50个字符']
  },
  account: {
    type: String,
    required: [true, '账号是必填项'],
    unique: true,
    minlength: [4, '账号长度至少4个字符'],
    maxlength: [20, '账号长度不能超过20个字符']
  },
  password: {
    type: String,
    required: [true, '密码是必填项'],
    minlength: [4, '密码长度至少4个字符'],
    select: false
  },
  sex: {
    type: String,
    required: [true, '性别是必填项'],
    enum: ['男', '女', '其他']
  },
  phone: {
    type: String,
    required: [true, '电话号码是必填项'],
    match: [/^\d{11}$/, '请输入有效的11位电话号码']
  },
  role: {
    type: String,
    default: 'recruiter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);