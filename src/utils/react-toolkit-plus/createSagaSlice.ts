import {ActionCreatorWithoutPayload, ActionCreatorWithPayload, createAction} from '@reduxjs/toolkit'


type ActionCreatorForSagas<F> = F extends (action: infer Action, state?: any) => any
  ? Action extends { payload: infer P }
    ? ActionCreatorWithPayload<P>
    : ActionCreatorWithoutPayload
  : ActionCreatorWithoutPayload


export default function createSaga<S>(sagas: S) {
  type SagaName = keyof S

  type ActionCreators = {
    [P in SagaName]: ActionCreatorForSagas<S[P]>
  }

  const keys = Object.keys(sagas)
  let actionCreators = {} as ActionCreators

  for (let key of keys) {
    // @ts-ignore
    actionCreators[key as SagaName] = createAction(`@EFFECT/${key}`, (...args) => {
      return {
        payload: args[0],
        meta: {
          thunk: true
        }
      }
    })
  }

  return {
    effects: sagas,
    actionCreators
  }
}
