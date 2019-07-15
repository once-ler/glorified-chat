/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import { navAction } from '../Nav'
import Presentation from './Presentation'

const mapDispatchToProps = dispatch => ({
  dispatch
})

const connectFunc = connect(
  state => ({
    nav: state.nav,
    routing: state.routing,
    theme: state.theme,
    user: state.chat.user,
    redirectUrl: state.app.redirectUrl
  }),
  mapDispatchToProps
)

const enhanceWithLifecycle = lifecycle({
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // logged in
      this.props.router.push(nextProps.redirectUrl)
      // console.log('LOGGEDIN')
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.router.push('/')
    }    
  },
  componentWillUpdate(nextProps, nextState) {
    // Collapse responsive nav once user has selected next link.
    if (!this.props.nav.collapse) {
      this.props.dispatch(navAction.reset())
    }
  },
  componentWillMount() {
    const { theme } = this.props
    document.body.style.backgroundColor = theme.secondary
  },
  componentWillUnmount() {
    document.body.style.backgroundColor = null
  },
  componentDidMount() {
    // For tests, place code when component finally mounts.
  }
})

export default compose(
  connectFunc,
  enhanceWithLifecycle
)(Presentation)
