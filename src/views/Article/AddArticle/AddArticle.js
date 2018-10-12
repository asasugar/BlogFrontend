import React from 'react'
import MarkDown from '@/components/MarkDown'
import request from '@/utils/request'

import { Button, message, Input } from 'antd'
import style from './AddArticle.scss'

class AddArticle extends React.Component {
  state = {
    tagName: ''
  }

  componentDidMount() {}
  componentWillUnmount() {}

  tagNameChange = e => {
    this.setState({ tagName: e.target.value })
  }

  save = async () => {
    if (
      this.refs.markDown.state.form.title &&
      this.refs.markDown.state.form.content
    ) {
      const { data } = await request({
        data: Object.assign(this.refs.markDown.state.form, {
          tagName: this.state.tagName
        }),
        url: '/addArticle',
        method: 'post'
      })
      if (data.success) {
        message.success(data.msg)
        this.props.history.go(-1)
      }
    } else {
      message.error('文章标题或者内容不能为空')
    }
  }
  render() {
    return (
      <div className={style['add-article']}>
        <MarkDown ref="markDown" />

        <div className={style.btn}>
          <Input
            placeholder="请输入标签"
            value={this.state.tagName}
            onChange={this.tagNameChange}
          />
          <Button type="primary" onClick={this.save} className={style.save}>
            保存
          </Button>
        </div>
      </div>
    )
  }
}

export default AddArticle
