import React from 'react'
import request from '@/utils/request'
import { setLocalStorage, getLocalStorage } from '@/utils/localStorage'

import { Form, Input, Button, Modal, Icon, message, Avatar } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
import { formatDate } from '@/utils'

import style from './ArticleDetail.scss'

class AddArticle extends React.Component {
  state = {
    detailInfo: {},
    userInfo: {},
    visible: false,
    isShowCommentBtn: false,
    commentValue: '',
    getCommentList: []
  }

  async componentDidMount() {
    await this.setState({
      detailInfo: this.props.location.state || getLocalStorage('articleInfo')
    })
    if (getLocalStorage('userInfo')) {
      await this.setState({
        userInfo: getLocalStorage('userInfo')
      })
    }
    this.getCommentList()
    console.log(this.refs)
  }
  componentWillUnmount() {}

  getCommentList = async () => {
    const { data } = await request({
      data: {
        userId: this.state.userInfo.userId || '',
        articleId: this.state.detailInfo.articleId
      },
      url: '/getCommentList'
    })
    if (data.success) {
      this.setState({ getCommentList: data.data })
    }
  }

  changeComment = async e => {
    this.setState({ commentValue: e.target.value })
  }

  login = async values => {
    const { data } = await request({
      data: values,
      url: '/login',
      method: 'post'
    })

    if (data.success) {
      // 将登录信息存储localStory
      setLocalStorage('userInfo', data.data)
      this.setState({
        userInfo: data.data,
        visible: false
      })
      this.props.form.resetFields()
      let t = setTimeout(() => {
        this.getCommentList()
        message.success('登录成功')
      }, 1000)
      clearTimeout(t)
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

  handleSubmitComment = async e => {
    e.preventDefault()
    console.log(this.state.userInfo)
    const { data } = await request({
      data: {
        content: this.state.commentValue,
        articleId: this.state.detailInfo.articleId,
        userId: this.state.userInfo.userId
      },
      url: '/addComment',
      method: 'post'
    })
    if (data.success) {
      message.success(data.msg)
      this.getCommentList()
    }
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
          <div className={style.content}>
            <div className={style.content1}>
              {/* <Avatar
                src={this.state.userInfo.headImg}
                style={{ marginRight: '5px' }}
              /> */}
              {getLocalStorage('userInfo') ? (
                <TextArea
                  id="comment"
                  autosize={{ minRows: 2, maxRows: 6 }}
                  onChange={this.changeComment}
                  placeholder="输入评论..."
                  onClick={() => this.setState({ isShowCommentBtn: true })}
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
            {this.state.isShowCommentBtn ? (
              <Button
                style={{ marginTop: '10px' }}
                key="submit"
                type="primary"
                disabled={this.state.commentValue ? false : true}
                onClick={this.handleSubmitComment}
              >
                评论
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className={style['comment-list']}>
          {this.state.getCommentList.map((item, index) => {
            return (
              <div className={style.item} key={index}>
                <div>
                  <Avatar src={item.headImg} style={{ marginRight: '5px' }} />
                </div>
                <div
                  style={{
                    borderBottom: '1px solid #f1f1f1',
                    color: '#505050'
                  }}
                >
                  <p style={{ color: '#333' }}>{item.userName}</p>
                  {item.content}
                  <p style={{ color: '#8a9aa9', marginTop: '5px' }}>
                    <Icon
                      type="clock-circle"
                      theme="outlined"
                      style={{ marginRight: '5px' }}
                    />
                    {formatDate(item.createTime)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Form.create()(AddArticle)
