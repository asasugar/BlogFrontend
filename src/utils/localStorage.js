export function setLocalStorage(key, val) {
  return window.localStorage.setItem(key, val)
}

export function getLocalStorage(key) {
  return window.localStorage.getItem(key)
}

export function clearStorage(key) {
  if (key) return window.localStorage.removeItem(key)
  else window.localStorage.clear()
}
