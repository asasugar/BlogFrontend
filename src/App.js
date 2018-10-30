import React, { Component } from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'

import routes from '@/routes/index'
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </div>
    )
  }
}
export default App
