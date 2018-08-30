import React from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'
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
  Input
} from 'antd'
import request from '@/utils/request'

const { Meta } = Card
const { Header, Content, Footer } = Layout
const confirm = Modal.confirm
const FormItem = Form.Item
class XLayout extends React.Component {
  state = {
    current: 'home',
    tags: ['很有想法的', '专注前端'],
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
    console.log(this.state.myInfo)
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

  signOut = () => {
    const _this = this
    confirm({
      title: 'Do you want to signOut?',
      onOk() {
        _this.setState({
          userInfo: null
        })
        message.success('Success')
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

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Layout className={style.layout}>
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
                <Icon type="appstore" />
                首页
              </Menu.Item>
              <Menu.Item key="message" className={style['menu-item']}>
                <Icon type="mail" />
                留言
              </Menu.Item>
              <Menu.Item key="about" className={style['menu-item']}>
                关于
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
                <FormItem hasFeedback={true}>
                  {getFieldDecorator('account', {
                    rules: [
                      { required: true, message: 'Please input your account!' }
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
                    <FormItem hasFeedback={true}>
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
                    <FormItem hasFeedback={true}>
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
                  <FormItem hasFeedback={true}>
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
                    <FormItem hasFeedback={true}>
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
                    <FormItem hasFeedback={true}>
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
                          this.state.colors[Math.floor(Math.random() * 10 + 1)]
                        }
                        key={index}
                      >
                        {item}
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
                <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
              </Col>
            </Row>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Form.create()(XLayout)
