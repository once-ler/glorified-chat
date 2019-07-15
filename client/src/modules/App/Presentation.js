import React, { Component } from 'react'
import ResponsiveRow from '../../components/Row/ResponsiveRow'
import Container from '../../components/Container/Container'
import { NavRow, NavCell, LogoCell } from '../Nav'
import BetterLink from '../../components/Link/BetterLink'
import LogoImage from '../../../static/demo.png'

const Presentation = props => (
  <Container>
    <NavRow wrap="true" end="true">
      <LogoCell>
        <img src={LogoImage} style={{height: '45px', marginRight: '8px'}}/>{'Chat Demo'}
      </LogoCell>
      <NavCell margin>
      <BetterLink to="/" onlyActiveOnIndex>Chat</BetterLink>
      </NavCell>      
      <NavCell>
      <BetterLink to="/logout" onClick={()=>(false)}>Logout</BetterLink>
      </NavCell>
    </NavRow>
    <ResponsiveRow style={{marginTop: -10}}>
      {props.children}
    </ResponsiveRow>
  </Container>
)

export default Presentation
