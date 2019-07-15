/* @flow */
import { greenTheme } from '../../components/Theme/Theme'
const CHANGE_THEME = 'CHANGE_THEME'

export default (state = greenTheme, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, theme: action.theme }
  default:
    return state
  }
}

export const changeTheme = theme => ({type: CHANGE_THEME, theme})
