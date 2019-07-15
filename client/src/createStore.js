/* @flow */
/* eslint no-undef: 0, flowtype/no-weak-types: 0, max-len: 0 */
import { createStore as _createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import reducer from './modules/reducer'
import rootEpic from './modules/epic'
import DevTools from './modules/DevTools/DevTools'

export default function createStore(data = {}) {
  // redux related book keeping
  const epicMiddleware = createEpicMiddleware()
  const middleware = [epicMiddleware]
  const finalReducer = combineReducers({ ...reducer })

  let store

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    store = _createStore(finalReducer, compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    ))

    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'))
    })
    module.hot.accept('./modules/epic', () => {
      epicMiddleware.replaceEpic(require('./modules/epic'))
    })
  } else {
    const finalCreateStore = applyMiddleware(...middleware)(_createStore)
    store = finalCreateStore(finalReducer, data)
  }

  epicMiddleware.run(rootEpic)
  
  return store;
}