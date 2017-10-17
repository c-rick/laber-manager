const MD5 = require('js-md5')

module.exports = {
  md5: (password) => MD5(password),
  hashSalt: (password) => {
    const salt = Math.floor(Math.random() * password.length) + new Date().getTime().toString().substr(8, 13);
    const hash = MD5(password + salt);
    return `${hash}:${salt}`
  },
  inspectSalt: (password, hashSalt) => {
    const arr = hashSalt.split(':');
    return MD5(password + arr[1]) === arr[0]
  }
}
