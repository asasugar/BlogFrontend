import React from 'react'
import request from '@/utils/request'
import { setLocalStorage, getLocalStorage } from '@/utils/localStorage'

import { Form, Input, Button, Modal, Icon, message } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

import style from './ArticleDetail.scss'

class AddArticle extends React.Component {
  state = {
    detailInfo: {},
    userInfo: {},
    visible: false,
    getCommentList: []
  }

  componentDidMount() {
    this.setState({ detailInfo: this.props.location.state })
    this.getCommentList()
  }
  componentWillUnmount() {}

  getCommentList = async () => {
    const { data } = await request({
      url: '/getCommentList'
    })
    if (data.success) {
      this.setState({ getCommentList: data.data })
    }
  }

  submitComment = async () => {}
  save = async () => {}

  login = async values => {
    const { data } = await request({
      data: values,
      url: '/login',
      method: 'post'
    })

    if (data.success) {
      // 将登录信息存储localStory
      setLocalStorage('userInfo', JSON.stringify(data.data))
      this.setState({
        userInfo: data.data,
        visible: false
      })
      this.props.form.resetFields()
      let t = setTimeout(() => {
        message.success('登录成功')
      }, 1000)
      clearTimeout(t)
      window.location.reload()
    } else message.error(data.msg)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.login(values)
        console.log('Received values of form: ', values)
      }
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className={style['article-detail']}>
        <Modal
          visible={this.state.visible}
          title="登录"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              返回
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleSubmit}>
              确定
            </Button>
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem hasFeedback={true}>
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
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Account"
                />
              )}
            </FormItem>
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
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
          </Form>
        </Modal>
        <div
          className={style.detail}
          ref={node => (this.previewWrap = node)}
          dangerouslySetInnerHTML={{ __html: this.state.detailInfo.content }}
        />
        <div className={style.comment}>
          <p className={style.title}>评论</p>
          <div />
          {JSON.parse(getLocalStorage('userInfo')) ? (
            <TextArea
              id="comment"
              autosize={{ minRows: 2, maxRows: 6 }}
              onPressEnter={this.submitComment}
            />
          ) : (
            <div className={style['no-login']}>
              <div
                className={style.btn}
                onClick={() => this.setState({ visible: true })}
              >
                登录
              </div>
              <span>说说你的看法</span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Form.create()(AddArticle)
