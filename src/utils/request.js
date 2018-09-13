import axios from 'axios'
import qs from 'qs'
axios.defaults.withCredentials = true
const request = ({ method = 'get', url, data = {} }, otherConfig = {}) => {
  url = /http/.test(url) ? url : `http://192.168.7.77:7001/blog${url}`
  let config = {
    method,
    url,
    [method === 'get' ? 'params' : 'data']:
      method === 'get' ? data : qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    ...otherConfig
  }
  Object.assign(config, otherConfig)
  return axios(config)
}
export default request
