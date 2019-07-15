/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import ResponsiveRow from '../Row/ResponsiveRow'

const DefaultContainer = styled.div `
  display: flex;
  flex-direction: column;
  font-family: ${props => props.fontFamily || props.theme.fontFamily};
  font-size: ${props => props.fontSize || props.theme.fontSize};
  background-color: ${props => props.backgroundColor || props.theme.backgroundColor};
  padding: ${props => props.padding}
  margin: ${props => props.margin}
  height: ${props => props.height ? props.height : '100%'}
  width: ${props => props.width ? props.width : '100%'}
  opacity: ${props => props.opacity ? props.opacity : 1}
`

const Container = props => {
  return (
    <ThemeProvider theme={props.theme}>
      <DefaultContainer {...props}>{props.children}</DefaultContainer>
    </ThemeProvider>
  )
}

export default connect(
  state => ({theme: state.theme})
)(Container)
