// trialStudent.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrialStudentSchema = new Schema({
  // 基础信息
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  // 可选信息
  score: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    required: false
  },
  grade: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false,
  },
  school: {
    type: String,
    required: false
  },

  teacher: {
    type: String,
    required: true,
    unique: true
  },
  
  // 系统信息
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrialStudent', TrialStudentSchema);