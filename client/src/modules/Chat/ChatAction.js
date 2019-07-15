
/* @flow */
export const CHANGE_USER = 'CHANGE_USER'
export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_REJECTED = 'FETCH_USER_REJECTED'
export const FETCH_USER_CANCELLED = 'FETCH_USER_CANCELLED'
export const PUSH_MESSAGE = 'PUSH_MESSAGE'
export const RESET_MESSAGE = 'RESET_MESSAGE'

const initialState = {
  user: '',
  loading: false,
  data: null,
  error: null,
  message: ''
}

const endpoints = {
  user: '/user',
  ws: '/ws'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_USER:
      return { ...state, ...action }
    case FETCH_USER:
      return { ...state, ...action, loading: true }
    case FETCH_USER_SUCCESS:
      const user = action.payload.exist === false ? action.payload.name : ''
      const error = action.payload.exist === false ? null : `Sorry!  ${action.payload.name} is already in the room`
      return { ...state, loading: false, data: action.payload, error, user }
    case FETCH_USER_REJECTED:
      return { ...state, loading: false, data: null, error: action }
    case FETCH_USER_CANCELLED:
      return { ...state, loading: false, data: null, error: null }
    case PUSH_MESSAGE:
      return { ...state, ...action }
    case RESET_MESSAGE:
      return {...state, message: ''}
    default:
      return state
  }
}

export const changeUser = user => ({type: CHANGE_USER, user})

export const fetchUser = user => ({type: FETCH_USER, url: `${endpoints.user}/${user}`})

export const fetchUserSuccess = payload => ({ type: FETCH_USER_SUCCESS, payload })

export const pushMessage = message => ({ type: PUSH_MESSAGE, message })

export const resetMessage = () => ({ type: RESET_MESSAGE })
