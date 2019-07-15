/* @flow */
import {FETCH_USER, FETCH_USER_CANCELLED, FETCH_USER_REJECTED, fetchUserSuccess} from './ChatAction'
import { ajax } from 'rxjs/ajax'
import {of, from} from 'rxjs'
import {map, catchError, mergeMap, takeUntil} from 'rxjs/operators'
import { ofType } from 'redux-observable'

export const fetchUserEpic = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_USER),
    mergeMap(action => {
        const src = typeof action.promise !== 'undefined' ? from(action.promise) : ajax(action.url)
        // Could be rx AjaxResponse or xhr Response
        return src.pipe(
          map(d => fetchUserSuccess(d.hasOwnProperty('response') ? d.response : d)),
          takeUntil(action$.pipe(ofType(FETCH_USER_CANCELLED))),
          catchError(error => of({
            type: FETCH_USER_REJECTED,
            payload: error,
            error: true
          }))
        )
      }
    )
  )