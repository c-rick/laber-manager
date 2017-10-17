
export default class Session {
  _generateKey (key) {
    let date = new Date()
    let datekey = `${date.getYear()}${date.getMonth()}${date.getDay()}`
    return `${key}${datekey}`
  }

  set (key, value) {
    if (typeof value === 'string') {
      sessionStorage.setItem(this._generateKey(key), value)
    } else if (typeof value === 'object') {
      sessionStorage.setItem(this._generateKey(key), JSON.stringify(value))
    } else {
      throw new Error('Unknown value types')
    }
  }

  get (key) {
    return sessionStorage.getItem(this._generateKey(key))
  }

  getObject (key) {
    let value = sessionStorage.getItem(this._generateKey(key))
    return value ? JSON.parse(value) : undefined
  }

  remove (key) {
    sessionStorage.removeItem(this._generateKey(key))
  }

  clear () {
    sessionStorage.clear()
  }
}
