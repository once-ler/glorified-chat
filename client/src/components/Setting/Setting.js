import {css} from 'styled-components'

// sm-md: 14em
// lg: 48em
export const sizes = {
  laptop: 800,
  tablet: 600,
  phablet: 376,
  fromLaptop: 800,
  fromTablet: 600,
  fromPhablet: 376
}

export const media = Object.keys(sizes).reduce((accumulator, label) => {
  accumulator[label] = (...args) => css`
    @media only screen and (${ label.search(/^from/) !== -1 ? 'min' : 'max' }-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return accumulator;
}, {})

export const growBasis = {
  auto: 'none',
  fit: '1 100%',
  full: '0 0 99%',
  halves: '0 0 49.4%',
  thirds: '0 0 32.4%',
  quarters: '0 0 24.4%'
}

export const crossAxisAlign = {
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center'
}

export const rowGutters = {
  sm1: '-1em 0 1em -1em',
  md1: '-1.5em 0 1.5em -1.5em',
  lg1: '-1.7em 0 -1.7em -1.7em'
}

export const cellGutters = {
  sm: 'padding: 1em 0 0 1em',
  md: 'padding: 1.5em 0 0 1.5em',
  lg: 'padding: 2em 0 0 2em'
}

export const getAlign = align => {
  if (align === 'start') return 'flex-start';
  if (align === 'end') return 'flex-end';
  if (align === 'between') return 'space-between';
  if (align === 'around') return 'space-around';
  return align;
}
