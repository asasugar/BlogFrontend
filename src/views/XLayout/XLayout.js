import React from 'react'
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
  Calendar
} from 'antd'
import Home from '../Home/Home'
import Message from '../Message/Message'
import About from '../About/About'
const { Meta } = Card
const { Header, Content, Footer } = Layout

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
    ]
  }
  componentDidMount() {}
  handleClick = e => {
    this.setState({
      current: e.key
    })
  }
  onPanelChange(value, mode) {
    console.log(value, mode)
  }
  getComponent = () => {
    switch (this.state.current) {
      case 'about':
        return <About />
        break

      case 'message':
        return <Message />
        break

      default:
        return <Home />
        break
    }
  }

  render() {
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
                      <Menu.Item>
                        <Icon type="logout" />
                        退出登录
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <a className="ant-dropdown-link" href="#">
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      style={{ marginRight: '5px' }}
                    />
                    我是你鸡哥
                  </a>
                </Dropdown>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className={style.content}>
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
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title="Ji_Brother"
                    description="JUST DO IT"
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
                {this.getComponent()}
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

export default XLayout
