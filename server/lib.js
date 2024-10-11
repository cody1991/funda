// crypto.js
const crypto = require('crypto');
require('dotenv').config();
// 定义加密算法和密钥
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.CRYPTO_SECRET); // 生成一个随机的 32 字节密钥
const iv = crypto.randomBytes(16); // 生成一个随机的初始化向量

// 加密函数
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'), // 返回初始化向量
    encryptedData: encrypted,
  };
}

// 解密函数
function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, 'hex'),
  );
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
