const express = require('express');
const { User } = require('../model');
const router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();

const { encrypt } = require('../lib');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // 加密输入的密码以便查找
  const encryptedInputPassword = JSON.stringify(encrypt(password));
  // 查找用户
  let user = await User.findOne({
    where: { email, password: encryptedInputPassword },
  });

  // 如果用户不存在，则创建新用户
  if (!user) {
    user = await User.create({ email, password });
    // 生成 JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.status(201).json({ token, user: { email: user.email } }); // 返回 token 和用户信息
  }

  // 解密密码
  const decryptedPassword = user.getDecryptedPassword();

  console.log('decryptedPassword', decryptedPassword);

  // 验证密码
  const isPasswordValid = decryptedPassword === password; // 直接比较解密后的密码
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // 生成 JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, user: { email: user.email } }); // 返回 token 和用户信息
});

module.exports = router;
