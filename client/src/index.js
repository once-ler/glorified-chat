/* @flow */
import React from 'react'
import {render} from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import createStore from './createStore'
import getRoutes from './routes'

const store = createStore(window.__data || {})
const history = syncHistoryWithStore(browserHistory, store)

const routes = (
  <Router history={history}>
    {getRoutes(store)}
  </Router>
)

const dest = document.getElementById('root')

render(
  <Provider store={store} key="provider">
    {routes}
  </Provider>,
  dest
)
