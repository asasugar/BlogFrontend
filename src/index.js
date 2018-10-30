import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import store from './store'
import './index.scss'
import App from './App'

console.log(store, 111)
import registerServiceWorker from './registerServiceWorker'
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
