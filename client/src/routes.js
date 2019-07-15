/* eslint no-unused-vars:0 */
import React from 'react'
import { IndexRoute, Route } from 'react-router'
import App from './modules/App/App'
import Chat from './modules/Chat/Chat'
import Login from './modules/Login/Login'
import NotFound from './modules/NotFound/NotFound'
import * as appActions from './modules/App/AppAction'

/* @flow */
export default (store: any) => {

  const requireLogin = (nextState, replace, cb) => {
    const { router } = nextState;
    function checkAuth() {
      const { 
        chat: { user }, 
        routing: { locationBeforeTransitions: {pathname} } 
      } = store.getState()
      
      if (!user) {
        store.dispatch(appActions.setRedirectUrl(pathname))
        replace('/login')
      }
      cb()
    }

    checkAuth()
  }

  return (
    <Route path="/" component={App}>
    <IndexRoute onEnter={requireLogin} component={Chat} />
    <Route path="/static/*" onEnter={requireLogin} component={Chat} />
    <Route path="/login" component={Login} />
    { /* Catch all route */ }
    <Route path="*" component={NotFound} status={404} />
    </Route>
  )
}