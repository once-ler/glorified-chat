/* @flow */
/* eslint no-implicit-coercion: 0, no-extra-boolean-cast: 0, max-len: 0 */
import styled, { css } from 'styled-components'
import { getAlign } from '../Setting/Setting'

const rowFuncs = {
  gutter: ({ column, gutter, unit }) => {
    if (!gutter) {
      return;
    }

    const g = (gutter / 2) + unit;

    return column ?
      css `
      margin-top: -${g};
      margin-bottom: -${g};
      & > div { padding-top: ${g}; padding-bottom: ${g}; }
    ` : css `
      margin-left: -${g};
      margin-right: -${g};
      & > div { padding-left: ${g}; padding-right: ${g}; }
    `;
  },
  absolute: () => `
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
  `,
  column: () => `
    height: 100%;
    flex-direction: column;
  `,
  inline: () => `
    min-width: auto;
    display: inline-flex;
  `,
  reverse: p => css `
    flex-direction: ${p.column ? 'column-reverse' : 'row-reverse'};
  `,
  wrap: () => `
    flex-wrap: wrap;
    align-content: stretch;
  `,
  wrapStart: () => `
    flex-wrap: wrap;
    align-content: flex-start;
  `,
  wrapCenter: () => `
    flex-wrap: wrap;
    align-content: flex-center;
  `,
  wrapEnd: () => `
    flex-wrap: wrap;
    align-content: flex-end;
  `,
  wrapBetween: () => `
    flex-wrap: wrap;
    align-content: space-between;
  `,
  wrapAround: () => `
    flex-wrap: wrap;
    align-content: space-around;
  `,
  top: () => `
    align-items: flex-start;
  `,
  middle: () => `
    align-items: center;
  `,
  bottom: () => `
    align-items: flex-end;
  `,
  baseline: () => `
    align-items: baseline;
  `,
  start: () => `
    justify-content: flex-start;
  `,
  center: () => `
    justify-content: center;
  `,
  end: () => `
    justify-content: flex-end;
  `,
  around: () => `
    justify-content: space-around;
  `,
  between: () => `
    justify-content: space-between;
  `
}

const Row = styled.div `
  display  : flex;
  flex-wrap: nowrap;
  
  ${ props => (
    Object.keys(rowFuncs)
      .map( n => !!props[n] ? rowFuncs[n](props) : false )
      .filter( v => v )
  )}

  ${ props => props.text && css`
    text-align: ${props.text}
  `}

  ${ props => props.self && css`
    align-self: ${getAlign(props.self)}
  `}

  ${ props => props.items && css`
    align-items: ${getAlign(props.items)}
  `}

  ${p => p.padding && `
    padding: ${p.padding};
  `}

  ${p => p.opacity && `
    opacity: ${p.opacity};
  `}
`;

Row.defaultProps = {
  gutter: 0,
  unit: 'px'
}

export default Row