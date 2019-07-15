/* @flow */
/* eslint max-len: 0 */
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Row from '../../components/Row/Row'
import {NavIconCollapse, NavIconOpen} from '../../components/Icon/NavIcon'
import { media } from '../../components/Setting/Setting'
import { toggle } from './Action'

const DefaultRow = styled(Row) `
z-index: 101;
height: 100%;
margin: 0;
background-repeat: no-repeat;
background-attachment: fixed;
background-color: #3366FF;
margin-bottom: 10px;
box-shadow: 0 8px 6px -6px #777;
overflow: hidden;
${media.tablet `
  height: ${props => props.nav && props.nav.collapse ? '65px' : '100%'};
  overflow: hidden;
  justify-content: flex-start;    
`}
`

// dispatch() passed from parent App.
const NavRow = props => {
  const { children, dispatch, ...rest } = props
  return (
    <DefaultRow {...rest}>
    {children}
    { props.nav.collapse ? <NavIconCollapse onClick={e => dispatch(toggle())} /> : <NavIconOpen onClick={e => dispatch(toggle())} /> }
    </DefaultRow>
  )
}

export default connect(
  state => ({ nav: state.nav })
)(NavRow)
