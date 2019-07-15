/* @flow */
import styled from 'styled-components'
import Row from './Row'
import { media } from '../Setting/Setting'

const ResponsiveRow = styled(Row) `
  ${media.laptop `justify-content: space-around`};
  ${media.tablet `flex-flow: column wrap padding: 0`};
`

export default ResponsiveRow
