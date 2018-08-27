import React from 'react'
// import style from './XLayout.scss'
import { Layout, Menu, Icon } from 'antd'
import Home from '../Home/Home'
import Message from '../Message/Message'
import About from '../About/About'
const { Header, Content, Footer, Sider } = Layout
class XLayout extends React.Component {
  state = {
    current: 'home'
  }

  handleClick = e => {
    this.setState({
      current: e.key
    })
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
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken)
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type)
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="user" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="home">
                <Icon type="appstore" />
                首页
              </Menu.Item>
              <Menu.Item key="message">
                <Icon type="mail" />
                留言
              </Menu.Item>
              <Menu.Item key="about">关于</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            {this.getComponent()}
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
