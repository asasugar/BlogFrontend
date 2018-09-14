import React from 'react'
import { Tabs, List, Icon, Card, Button, message, Modal } from 'antd'
import style from './Home.scss'
import request from '@/utils/request'
import { isPower, formatDate } from '@/utils'
import { getLocalStorage } from '@/utils/localStorage'
const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const { Meta } = Card
class Home extends React.Component {
  state = {
    isActive: false,
    LinkIndex: null,
    articleList: [],
    projectList: []
  }

  _renderIconText({ type, text }) {
    return (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    )
  }

  likeOrComment = async (type, index) => {
    console.log(type, index)

    if (type === 'like-o') {
      // 点赞
      await this.setState({ isActive: !this.state.isActive })
      let articleList = []
      if (this.state.isActive) {
        articleList = this.state.articleList.map((item, idx) => {
          if (idx === index) {
            item.likeNum += 1
          }
          return item
        })
      } else {
        articleList = this.state.articleList.map((item, idx) => {
          if (idx === index) {
            item.likeNum -= 1
          }
          return item
        })
      }
      this.setState({ articleList, LinkIndex: index })
    }
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
  }
  changeTab(key) {
    console.log(key)
  }
  getList = async () => {
    const { data } = await request({
      url: '/getArticleList'
    })

    if (data.success) {
      // let articleList = data.data.map(item => {
      //   if (!item.coverImg) {
      //     // 默认图片
      //     item.coverImg =
      //       'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
      //   }
      //   return item
      // })
      this.setState({ articleList: data.data })
    }
  }
  // 到详情
  goDetail = info => {
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
  _renderDeleteIcon = articleId => {
    if (getLocalStorage('userInfo')) {
      let r = isPower(JSON.parse(getLocalStorage('userInfo')))
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

  _renderList = () => {
    return (
      <Tabs onChange={this.changeTab} type="line">
        <TabPane tab="文章" key="1">
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
                {this._renderDeleteIcon(item.articleId)}
                <List.Item
                  key={item.title}
                  actions={[
                    this._renderIconText({
                      type: 'area-chart',
                      text: item.readNum
                    }),
                    this._renderIconText({ type: 'message', text: 2 }),
                    this._renderIconText({
                      type: 'clock-circle',
                      text: formatDate(item.createTime)
                    })
                  ]}
                  // extra={<img width={272} alt="logo" src={item.coverImg} />}
                >
                  <List.Item.Meta
                    onClick={() => this.goDetail(item)}
                    title={<a href={item.href}>{item.title}</a>}
                  />
                  {/* {item.content} */}
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
        <Button
          type="primary"
          className={style.write}
          onClick={() => {
            console.log(this)
            this.props.history.push('/AddArticle')
          }}
        >
          写文章
        </Button>
      </div>
    )
  }
}

export default Home
