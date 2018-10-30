import { action, observable } from 'mobx'
// 启动严格模式
class User {
  // 创建全局变量
  @observable
  userInfo = {}
  @action
  saveUserInfo(val) {
    // 这里的@action就是和严格模式配套使用的装饰器，表示允许该函数修改@observable的值
    this.userInfo = val
  }
}
const user = new User()
export default user
