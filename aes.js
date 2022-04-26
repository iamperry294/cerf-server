const crypto = require("crypto");

function generateKey(aes) {
  const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
  const key = crypto.randomBytes(256 / 8).toString("hex").slice(0, 32);
  const algorithm = aes;
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return {cipher:cipher, decipher:decipher}
}

function encrypt(cipher, message) {
  let encryptedMsg = cipher.update(message, "utf8", "hex");
  return encryptedMsg += cipher.final("hex");
}

function decrypt(data, decipher) {
  let decryptedMsg = decipher.update(data, "hex", "utf8");
  return decryptedMsg += decipher.final("utf8");
}

module.exports = { generateKey: generateKey, encrypt: encrypt, decrypt: decrypt }

// Example Usage
const keys = generateKey('aes-256-cbc');
const cipher = keys.cipher;
const decipher = keys.decipher;

const encrypted = encrypt('hi', cipher);
console.log(encrypted);
console.log(decrypt(encrypted, decipher));
