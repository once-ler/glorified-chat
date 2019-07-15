/* @flow */
const NAV_COLLAPSE = 'NAV_COLLAPSE'

const initialState = {
  collapse: true
}

const nav = (state = initialState, action) => {
  switch (action.type) {
    case NAV_COLLAPSE:
      return {
        collapse: !state.collapse,
        ...action
      }
    default:
      return state
  }
}

export const toggle = () => {
  return {
    type: NAV_COLLAPSE
  }
}

export const reset = () => {
  return {
    type: NAV_COLLAPSE,
    collapse: true
  }
}

export default nav
