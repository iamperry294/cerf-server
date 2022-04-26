const crypto = require("crypto");

function generateKeys(bits) {
  return { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    modulusLength: bits,
})
}

function encrypt(key, data) {
  encrypteddata = crypto.publicEncrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(data)
  )
  return encrypteddata;
}

function decrypt(key, data) {
  decrypteddata = crypto.privateDecrypt(
    {
      key: key,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    data
  )
  return decrypteddata.toString();
}

module.exports = { generateKeys: generateKeys, encrypt: encrypt, decrypt: decrypt }