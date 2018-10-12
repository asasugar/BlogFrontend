import React from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter, Link } from 'react-router-dom'

import routes from '@/routes/index'
import style from './XLayout.scss'
import {
  Layout,
  Menu,
  Icon,
  Card,
  Avatar,
  Divider,
  Tag,
  Row,
  Col,
  Dropdown,
  Calendar,
  message,
  Modal,
  Button,
  Form,
  Input,
  Upload
} from 'antd'
import request from '@/utils/request'
import {
  setLocalStorage,
  getLocalStorage,
  clearStorage
} from '@/utils/localStorage'

const { Meta } = Card
const { Header, Content, Footer } = Layout
const confirm = Modal.confirm
const FormItem = Form.Item
class XLayout extends React.Component {
  state = {
    current: 'home',
    tags: [],
    colors: [
      'magenta',
      'red',
      'volcano',
      'orange',
      'gold',
      'green',
      'cyan',
      'blue',
      'geekblue',
      'purple'
    ],
    userInfo: null,
    myInfo: {},
    visible: false,
    loading: false,
    modalTitle: null
  }
  async componentWillMount() {
    // 相当于vue的created
    const { data } = await request({
      data: { userId: 1 },
      url: '/getUser'
    })
    if (data.success) {
      this.setState({ myInfo: data.data })
    }
    if (getLocalStorage('userInfo')) {
      this.setState({ userInfo: getLocalStorage('userInfo') })
    }
    this.getTagList()
  }
  async componentDidMount() {
    // 相当于vue的mouted
  }

  handleClick = e => {
    this.setState({
      current: e.key
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  getTagList = async () => {
    const { data } = await request({
      url: '/getTagList'
    })
    if (data.success) this.setState({ tags: data.data })
  }

  signOut = () => {
    const _this = this
    confirm({
      title: 'Do you want to signOut?',
      onOk() {
        _this.setState({
          userInfo: null
        })
        message.success('Success')
        clearStorage()
      },
      onCancel() {
        message.warning('Cancel')
      }
    })
  }

  loginOrRegOrForgot = type => {
    this.setState({ visible: true })
    if (type === 'login') this.setState({ modalTitle: '登录' })
    else if (type === 'reg') this.setState({ modalTitle: '注册' })
    else if (type === 'modifyPassword')
      this.setState({ modalTitle: '修改密码' })
  }

  onPanelChange(value, mode) {
    console.log(value, mode)
  }

  login = async values => {
    this.setState({ loading: true })

    const { data } = await request({
      data: values,
      url: '/login',
      method: 'post'
    })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1500)
    if (data.success) {
      // 将登录信息存储localStory
      setLocalStorage('userInfo', data.data)
      this.setState({
        userInfo: data.data,
        visible: false
      })
      this.props.form.resetFields()
      message.success('登录成功')
    } else message.error(data.msg)
  }

  reg = async values => {
    this.setState({ loading: true })
    console.log(values)
    values.headImg = values.headImg.file.response.data
    const { data } = await request({
      data: values,
      url: '/reg',
      method: 'post'
    })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1500)
    if (data.success) {
      this.setState({
        visible: false
      })
      this.props.form.resetFields()
      message.success('注册成功')
    } else message.error(data.msg)
  }

  modifyPassword = async values => {
    this.setState({ loading: true })

    const { data } = await request({
      data: values,
      url: '/modifyPassword',
      method: 'post'
    })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1500)
    if (data.success) {
      this.setState({
        visible: false
      })
      this.props.form.resetFields()
      message.success('修改成功')
    } else message.error(data.msg)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { modalTitle } = this.state
        console.log('Received values of form: ', values)

        if (modalTitle === '登录') this.login(values)
        else if (modalTitle === '注册') this.reg(values)
        else if (modalTitle === '修改密码') this.modifyPassword(values)
      }
    })
  }

  normFile = e => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }
    const props = {
      name: 'file',
      action: 'http://192.168.7.165:7001/blog/upload',
      headers: {
        authorization: 'authorization-text'
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      }
    }
    return (
      <BrowserRouter>
        <Layout className={style.layout} ref="layout">
          <Layout>
            <Header className={style.header}>
              <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
                theme="dark"
                className={style.menu}
              >
                <Menu.Item key="home" className={style['menu-item']}>
                  <Link to="/">
                    <Icon type="appstore" />
                    首页
                  </Link>
                </Menu.Item>

                <Menu.Item key="message" className={style['menu-item']}>
                  <Link to="/Message">
                    <Icon type="mail" />
                    留言
                  </Link>
                </Menu.Item>

                <Menu.Item key="about" className={style['menu-item']}>
                  <Link to="/About">
                    <Icon type="star" />
                    关于我
                  </Link>
                </Menu.Item>

                <Menu.Item
                  key="reg"
                  className={[style['menu-item'], style['menu-user']]}
                  onClick={this.loginOrRegOrForgot.bind(this, 'reg')}
                >
                  注册
                </Menu.Item>
                {this.state.userInfo ? (
                  <Menu.Item
                    key="user"
                    className={[style['menu-item'], style['menu-user']]}
                  >
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item>
                            <Icon type="user" />
                            个人中心
                          </Menu.Item>
                          <Menu.Item onClick={this.signOut}>
                            <Icon type="logout" />
                            退出登录
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <a className="ant-dropdown-link" href="#">
                        <Avatar
                          src={this.state.userInfo.headImg}
                          style={{ marginRight: '5px' }}
                        />
                        {this.state.userInfo.userName}
                      </a>
                    </Dropdown>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    ref="login"
                    key="login"
                    className={[style['menu-item'], style['menu-user']]}
                    onClick={this.loginOrRegOrForgot.bind(this, 'login')}
                  >
                    <Icon type="login" />
                    登录
                  </Menu.Item>
                )}
              </Menu>
            </Header>
            <Content className={style.content}>
              <Modal
                visible={this.state.visible}
                title={this.state.modalTitle}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" onClick={this.handleCancel}>
                    返回
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={this.state.loading}
                    onClick={this.handleSubmit}
                  >
                    确定
                  </Button>
                ]}
              >
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <FormItem hasFeedback={true} label="账号" {...formItemLayout}>
                    {getFieldDecorator('account', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your account!'
                        }
                      ]
                    })(
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: 'rgba(0,0,0,.25)' }}
                          />
                        }
                        placeholder="Account"
                      />
                    )}
                  </FormItem>

                  {this.state.modalTitle === '修改密码' ? (
                    <div>
                      <FormItem
                        hasFeedback={true}
                        label="旧密码"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('oldPassword', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your OldPassword!'
                            }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="password"
                            placeholder="OldPassword"
                          />
                        )}
                      </FormItem>
                      <FormItem
                        hasFeedback={true}
                        label="新密码"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('newPassword', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your NewPassword!'
                            }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            type="password"
                            placeholder="NewPassword"
                          />
                        )}
                      </FormItem>
                    </div>
                  ) : (
                    <FormItem
                      hasFeedback={true}
                      label="密码"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your Password!'
                          }
                        ]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                          }
                          type="password"
                          placeholder="Password"
                        />
                      )}
                    </FormItem>
                  )}
                  {this.state.modalTitle === '登录' ? (
                    <FormItem>
                      <a
                        className="login-form-modifyPassword"
                        onClick={this.loginOrRegOrForgot.bind(
                          this,
                          'modifyPassword'
                        )}
                      >
                        modify password
                      </a>
                      Or{' '}
                      <a onClick={this.loginOrRegOrForgot.bind(this, 'reg')}>
                        register now!
                      </a>
                    </FormItem>
                  ) : (
                    ''
                  )}
                  {this.state.modalTitle === '注册' ? (
                    <div>
                      <FormItem
                        hasFeedback={true}
                        label="昵称"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('userName', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your userName!'
                            }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="smile-o"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="UserName"
                          />
                        )}
                      </FormItem>
                      <FormItem
                        hasFeedback={true}
                        label="个性签名"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('remark', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your remark!'
                            }
                          ]
                        })(
                          <Input
                            prefix={
                              <Icon
                                type="edit"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                              />
                            }
                            placeholder="Remark"
                          />
                        )}
                      </FormItem>
                      <FormItem
                        hasFeedback={true}
                        label="头像"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('headImg')(
                          <Upload {...props}>
                            <Button>
                              <Icon type="upload" /> Upload
                            </Button>
                          </Upload>
                        )}
                      </FormItem>
                    </div>
                  ) : (
                    ''
                  )}
                </Form>
              </Modal>
              <Row gutter={48}>
                <Col className="gutter-row" span={6}>
                  <Card
                    className={style.card}
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                  >
                    <Meta
                      avatar={<Avatar src={this.state.myInfo.headImg} />}
                      title={this.state.myInfo.userName}
                      description={this.state.myInfo.remark}
                    />
                    <Divider dashed={true} />
                    <Meta
                      title="标签"
                      description={this.state.tags.map((item, index) => (
                        <Tag
                          color={
                            this.state.colors[
                              Math.floor(Math.random() * 10 + 1)
                            ]
                          }
                          key={index}
                        >
                          {item.tagName}
                        </Tag>
                      ))}
                    />
                  </Card>
                  <Card className={style.card}>
                    <Calendar
                      fullscreen={false}
                      onPanelChange={this.onPanelChange}
                    />
                  </Card>
                </Col>
                <Col className="gutter-row" span={18}>
                  {renderRoutes(routes)}
                </Col>
              </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    )
  }
}

export default Form.create()(XLayout)
