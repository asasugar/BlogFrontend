import React from 'react'
import request from '@/utils/request'

import style from './ArticleDetail.scss'

class AddArticle extends React.Component {
  state = {
    detailInfo: {}
  }

  componentDidMount() {
    this.setState({ detailInfo: this.props.location.state })
  }
  componentWillUnmount() {}

  save = async () => {}
  render() {
    return (
      <div className={style['article-detail']}>
        <div
          className=""
          ref={node => (this.previewWrap = node)}
          dangerouslySetInnerHTML={{ __html: this.state.detailInfo.content }}
        />
      </div>
    )
  }
}

export default AddArticle
