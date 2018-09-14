export const isPower = userInfo => {
  return userInfo.userId === 1
}
// Date对象转化成YYYY-MM-DD格式 | addMonth获取给点日期指定月份后日期
export const formatDate = date => {
  if (date === null) return ''
  let d = new Date(date)
  let year = d.getFullYear()
  let month =
    d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)
  let day = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate()
  let hours = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours()
  let min = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()
  let second = d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds()
  return `${year}-${month}-${day} ${hours}:${min}:${second}`
}
