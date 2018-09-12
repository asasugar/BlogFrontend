import React from 'react'
import marked from 'marked'
import highlight from 'highlight.js/lib/highlight'
import './markDown.css'
import request from '@/utils/request'

import { Button, message } from 'antd'
highlight.configure({
  tabReplace: '  ',
  classPrefix: 'hljs-',
  languages: [
    'CSS',
    'Scss',
    'Sass',
    'Less',
    'HTML, XML',
    'JavaScript',
    'Stylus',
    'TypeScript',
    'Markdown'
  ]
})

marked.setOptions({
  highlight(code) {
    return highlight.highlightAuto(code).value
  }
})
class AddArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aceBoxH: null,
      previewContent: '',
      loading: false,
      form: {
        title: '',
        content: '',
        coverImg: ''
      }
    }
    this.cacheValue()
    this.containerScroll = this.containerScroll.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    this.setState({
      aceBoxH:
        document.documentElement.clientHeight -
        document.querySelector('#edit-header').offsetHeight +
        'px'
    })
  }
  componentWillUnmount() {}

  cacheValue() {
    this.currentTabIndex = 1
    this.hasContentChanged = false
    this.scale = 1
  }

  setCurrentIndex(index) {
    this.currentTabIndex = index
  }

  containerScroll(e) {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop =
        this.editContainer.scrollTop * this.scale
    } else {
      this.editContainer.scrollTop =
        this.previewContainer.scrollTop / this.scale
    }
  }
  handleChange(e) {
    let form = Object.assign({}, this.state.form, {
      title: e.target.value
    })
    this.setState({
      form
    })
  }

  onContentChange(e) {
    console.log(e.target.innerText)
    let form = Object.assign({}, this.state.form, {
      content: e.target.innerText
    })
    this.setState({
      form,
      previewContent: marked(e.target.innerText)
    })
    !this.hasContentChanged && (this.hasContentChanged = true)
  }

  setScrollValue() {
    // 设置值，方便 scrollBy 操作
    this.scale =
      (this.previewWrap.offsetHeight - this.previewContainer.offsetHeight) /
      (this.editWrap.offsetHeight - this.editContainer.offsetHeight)
    this.hasContentChanged = false
  }
  save = async () => {
    const { data } = await request({
      data: this.state.form,
      url: '/addArticle',
      method: 'post'
    })
    if (data.success) {
      message.success(data.msg)
    }
  }
  render() {
    let state = this.state
    return (
      <div>
        <header className="edit-header" key="header" id="edit-header">
          <input
            type="text"
            className="title-input"
            placeholder="输入文章标题..."
            spellCheck="false"
            value={this.state.form.title}
            onChange={this.handleChange}
          />
        </header>

        <div
          className="editor-main-a"
          ref={node => (this.aceBox = node)}
          style={{ height: state.aceBoxH }}
          key="main"
        >
          <div
            className="common-container editor-container"
            onMouseOver={this.setCurrentIndex.bind(this, 1)}
            onScroll={this.containerScroll}
            ref={node => (this.editContainer = node)}
          >
            <div
              contentEditable="plaintext-only"
              name="editor-wrapper"
              id="editor-wrapper"
              className="common-wrapper editor-wrapper"
              onInput={this.onContentChange}
              ref={node => (this.editWrap = node)}
            />
          </div>
          <div
            className="common-container preview-container"
            ref={node => (this.previewContainer = node)}
            onMouseOver={this.setCurrentIndex.bind(this, 2)}
            onScroll={this.containerScroll}
          >
            <div
              className="markdown-body common-wrapper preview-wrapper"
              ref={node => (this.previewWrap = node)}
              dangerouslySetInnerHTML={{ __html: state.previewContent }}
            />
          </div>
        </div>
        <Button type="primary" loading={this.state.loading} onClick={this.save}>
          保存
        </Button>
      </div>
    )
  }
}

export default AddArticle
