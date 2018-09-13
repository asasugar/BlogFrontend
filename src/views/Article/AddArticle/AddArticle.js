import React from 'react'
import MarkDown from '@/components/MarkDown'
import request from '@/utils/request'

import { Button, message, Upload, Icon, Modal } from 'antd'
import style from './AddArticle.scss'

class AddArticle extends React.Component {
  state = {}

  componentDidMount() {}
  componentWillUnmount() {}

  save = async () => {
    if (
      this.refs.markDown.state.form.title &&
      this.refs.markDown.state.form.content
    ) {
      const { data } = await request({
        data: this.refs.markDown.state.form,
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
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text'
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info)
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        }
      }
    }

    return (
      <div className={style['add-article']}>
        <MarkDown ref="markDown" />
        <div className={style.btn}>
          <Upload {...props}>
            <Button className={style.upload}>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          <Button type="primary" onClick={this.save} className={style.save}>
            保存
          </Button>
        </div>
      </div>
    )
  }
}

export default AddArticle
