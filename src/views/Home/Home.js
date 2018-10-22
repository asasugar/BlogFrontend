import React from 'react'
import {
  Tabs,
  List,
  Icon,
  Card,
  Button,
  message,
  Modal,
  Tag,
  Form,
  Select
} from 'antd'
import style from './Home.scss'
import request from '@/utils/request'
import { isPower, formatDate } from '@/utils'
import { setLocalStorage, getLocalStorage } from '@/utils/localStorage'
const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option
const { Meta } = Card
class Home extends React.Component {
  state = {
    isActive: false,
    LinkIndex: null,
    articleList: [],
    projectList: [],
    tags: [],
    pageNo: 1,
    pageSize: 5,
    tagName: '',
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
    ]
  }

  _renderIconText({ type, text, info }) {
    return (
      <span onClick={() => this.goDetail(info)}>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    )
  }
  _renderTag(text) {
    return (
      <Tag color={this.state.colors[Math.floor(Math.random() * 10 + 1)]}>
        {text ? text : '未分类'}
      </Tag>
    )
  }

  async componentWillMount() {
    this.getList()
    let projectList = []
    for (let i = 0; i < 23; i++) {
      projectList.push({
        alt: 'example',
        avatar: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        title: `Europe Street beat ${i}`,
        description: 'www.instagram.com'
      })
    }
    this.setState({ projectList })
    this.getTagList()
  }
  changeTab(key) {
    console.log(key)
  }
  getList = async tagName => {
    console.log(tagName)
    const { data } = await request({
      data: {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
        tagName
      },
      url: '/getArticleList'
    })

    if (data.success) {
      this.setState({ articleList: data.data })
    }
  }
  // 到详情
  goDetail = info => {
    setLocalStorage('articleInfo', info)
    this.props.history.push('/ArticleDetail', info)
  }
  // 删除
  deleteArticle = id => {
    confirm({
      title: 'Do you want to delete?',
      onOk: async () => {
        const { data } = await request({
          url: '/deleteArticle',
          data: { articleId: id },
          method: 'post'
        })
        if (data.success) {
          message.success(data.msg)
          this.getList()
        }
      },
      onCancel() {
        message.warning('Cancel')
      }
    })
  }
  // 是否显示删除按钮
  _renderDeleteBtn = articleId => {
    if (getLocalStorage('userInfo')) {
      let r = isPower(getLocalStorage('userInfo'))
      if (r) {
        return (
          <Icon
            type="delete"
            className={style.delete}
            onClick={() => this.deleteArticle(articleId)}
          />
        )
      }
    }
  }

  getTagList = async () => {
    const { data } = await request({
      url: '/getTagList'
    })
    if (data.success) this.setState({ tags: data.data })
  }

  onSelect = (key, e) => {
    this.setState({ tagName: e.props.children })
    this.getList(e.props.children)
  }

  // 是否显示写文章按钮
  _renderAddBtn = () => {
    if (getLocalStorage('userInfo')) {
      let r = isPower(getLocalStorage('userInfo'))
      if (r) {
        return (
          <Button
            type="primary"
            className={style.write}
            onClick={() => {
              this.props.history.push('/AddArticle')
            }}
          >
            写文章
          </Button>
        )
      }
    }
  }
  _renderList = () => {
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
    return (
      <Tabs onChange={this.changeTab} type="line">
        <TabPane tab="文章" key="1">
          <Form>
            <FormItem {...formItemLayout} label="分类" hasFeedback>
              <Select placeholder="请选择分类" onSelect={this.onSelect}>
                {this.state.tags.map((item, index) => (
                  <Option key={index}>{item.tagName}</Option>
                ))}
              </Select>
            </FormItem>
          </Form>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: page => {
                console.log(page)
              },
              pageSize: 5
            }}
            dataSource={this.state.articleList}
            renderItem={(item, index) => (
              <div className={style.item}>
                {this._renderDeleteBtn(item.articleId)}
                <List.Item
                  key={item.title}
                  actions={[
                    this._renderTag(item.tagName),
                    this._renderIconText({
                      type: 'message',
                      text: item.commentNum,
                      info: item
                    }),
                    this._renderIconText({
                      type: 'clock-circle',
                      text: formatDate(item.createTime),
                      info: item
                    })
                  ]}
                  // extra={<img width={272} alt="logo" src={item.coverImg} />}
                >
                  <List.Item.Meta
                    onClick={() => this.goDetail(item)}
                    title={<a href={item.href}>{item.title}</a>}
                  />
                </List.Item>
              </div>
            )}
          />
        </TabPane>
        <TabPane tab="项目" key="2">
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 2,
              xxl: 2
            }}
            pagination={{
              onChange: page => {
                console.log(page)
              },
              pageSize: 4
            }}
            dataSource={this.state.projectList}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <img
                      className={style['cover-img']}
                      alt={item.alt}
                      src={item.avatar}
                    />
                  }
                >
                  <Meta title={item.title} description={item.content} />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    )
  }
  render() {
    return (
      <div className={style.home}>
        {this._renderList()}
        {this._renderAddBtn()}
      </div>
    )
  }
}

export default Home
