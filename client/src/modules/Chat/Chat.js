/* @flow */
import React from 'react'
import {View, StyleSheet} from 'react-native'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withHandlers from 'recompose/withHandlers'
import withProps from 'recompose/withProps'
import FlatListTab from '../List/FlatListTab'
import * as flatListAction from '../List/FlatListAction'

const mapDispatchToProps = dispatch => ({
  dispatch
})

const connectFunc = connect(
  state => ({
    wsUrl: state.app.wsUrl,
    user: state.chat.user
  }),
  mapDispatchToProps
)

const enhanceWithProps = withProps(props => ({
  ws: new WebSocket(`${props.wsUrl}/${props.user}`)
}))

const enhanceWithHandlers = withHandlers({
  onopen: () => () => {
    // No op.
  },
  onmessage: ({dispatch, ws}) => evt => {
    dispatch(flatListAction.listFetchFullfilled([evt.data]))
  },
  onclose: ({ws}) => () => {
    // Automatically try to reconnect on connection loss
    ws = new WebSocket(URL)
  },
  send: ({ws}) => message => {
    ws.send(message)
  }
});

const enhanceWithLifecycle = lifecycle({
  componentDidMount() {
    this.props.ws.onopen = this.props.onopen
    this.props.ws.onmessage = this.props.onmessage
    this.props.ws.onclose = this.props.onclose
  }
})

const Presentation = props => (
  <View style={styles.container}>
  <FlatListTab {...props} />
  </View>
)

export default compose(
  connectFunc,
  enhanceWithProps,
  enhanceWithHandlers,
  enhanceWithLifecycle
)(Presentation)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 500,
    maxHeight: 500,
    width: '100%'
  }
})
