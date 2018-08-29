import axios from 'axios'
import qs from 'qs'
axios.defaults.withCredentials = true
const request = ({ method = 'get', url, data = {} }, otherConfig = {}) => {
  let config = {
    method,
    url: `http://127.0.0.1:7001/blog${url}`,
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
