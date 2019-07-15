/* @flow */

export const LOGGED_IN = 'LOGGED_IN'
export const REDIRECT_URL = 'REDIRECT_URL'

const initialState = {
  wsUrl: ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws",
  isLoggedIn: false,
  redirectUrl: null
}

export default (state: any = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return {...state, ...action, isLoggedIn: true}
    case REDIRECT_URL:
      return {...state, ...action}
    default:
      return state
  }
}

export const setLoggedIn = () => ({type: LOGGED_IN})

export const setRedirectUrl = redirectUrl => ({type: REDIRECT_URL, redirectUrl})
