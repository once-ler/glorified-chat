/* @flow */
/* eslint no-unused-vars:0 */
import { combineEpics } from 'redux-observable'
import { fetchUserEpic } from './Chat/ChatEpic'

export default combineEpics(
  fetchUserEpic
);