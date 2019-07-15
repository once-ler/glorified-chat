/* @flow */
import { routerReducer as routing } from 'react-router-redux'
import theme from './App/ThemeAction'
import nav from './Nav/Action'
import list from './List/FlatListAction'
import chat from './Chat/ChatAction'
import app from './App/AppAction'

export default {
  routing,
  theme,
  nav,
  list,
  chat,
  app
}
