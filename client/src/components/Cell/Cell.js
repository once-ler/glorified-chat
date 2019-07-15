/* @flow */
/* eslint no-implicit-coercion: 0, no-extra-boolean-cast: 0, max-len: 0 */
import styled, { css } from 'styled-components'
import { growBasis } from '../Setting/Setting'

const cellFuncs = {
  order: (val: number) => css `
    order: ${val}
  `,
  margin: () => `
    margin: auto;
  `,
  stretch: () => `
    align-self: stretch;
  `,
  start: () => `
    align-self: flex-start;
  `,
  end: () => `
    align-self: flex-end;
  `,
  center: () => `
    align-self: center;
  `,
  baseline: () => `
    align-self: baseline;
  `
}

const Cell = styled.div `  
  ${ props => (
    Object.keys(cellFuncs)
      .map( n => !!props[n] ? cellFuncs[n](props) : false )
      .filter( v => v )
  )}

  ${p => p.growBasis && `
    flex: ${typeof p.growBasis === 'number' ? p.growBasis : (growBasis[p.growBasis] || 'none')}
    `
  }

  ${p => p.width && `width: ${p.width}`}

  ${p => p.maxWidth && `max-width: ${p.maxWidth}`}
`

Cell.defaultProps = {
  flex: '0 1 auto'
}

export default Cell
