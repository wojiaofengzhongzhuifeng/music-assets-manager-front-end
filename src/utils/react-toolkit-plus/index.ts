import {configureStore, createSlice, PayloadAction, Slice} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector
} from 'react-redux'
import {middleware as thunkMiddleware} from 'redux-saga-thunk'
import {AnyAction} from 'redux'
import createSagaSlice from './createSagaSlice'
import createRootSaga from './createRootSaga'

export {request, serviceWrapper} from './request'
export type {ServiceMap, OtherOptions} from './request'


export type Effects<S = any, A = any, > = {
  [effectName: string]: (action: A, state?: S) => {
    dataSource: () => any;
    successHandler(response: any): Generator;
  }
};

export interface Dispatch<T extends AnyAction = AnyAction> {
  (action: T): T
}

export interface Dispatch {
  (action: AnyAction): Promise<unknown>
}


export function makeStore<T extends { [k: string]: Slice }, G extends Effects>(
  reducerOptions: T, sagas: G) {

  type EffectActionType = keyof G

  type LoadingEffects = { [P in EffectActionType]: boolean }

  type LoadingState = {
    effects: LoadingEffects,
    global: boolean
  }

  type ReducerMap = {
    [k: string]: Slice['reducer']
  }

  type ActionCreatorsMap = {
    [k: string]: Slice['actions']
  }

  type sagaActionCreator = typeof sagaSlice['actionCreators']

  type FinnalActionCreators = {
    [p in keyof T]: T[p]['actions']
  } & {
    effect: sagaActionCreator
  }


  const loadingSlice = createSlice<LoadingState, any>({
    name: 'loading',
    initialState: {
      effects: {} as LoadingEffects,
      global: false
    },
    reducers: {
      SHOW_LOADING: (state: LoadingState, action: PayloadAction<EffectActionType>) => {
        state.global = true
        state.effects[action.payload] = true
      },
      HIDE_LOADING: (state: LoadingState, action: PayloadAction<EffectActionType>) => {
        state.effects[action.payload] = false
        const namespaces = Object.keys(state.effects)
        if (namespaces.length) {
          state.global = !namespaces.every(namespace => state.effects[namespace as EffectActionType] === false)
        }
      }
    }
  });

  const SagaMiddleware = createSagaMiddleware()
  const sagaSlice = createSagaSlice<G>(sagas)
  const reducerMap = {} as ReducerMap
  let actionCreators = {} as ActionCreatorsMap
  const keys = Object.keys(reducerOptions)

  for (let sliceName of keys) {
    reducerMap[sliceName] = reducerOptions[sliceName].reducer
    actionCreators[sliceName] = reducerOptions[sliceName].actions
  }

  reducerMap.loading = loadingSlice.reducer

  actionCreators = {
    ...actionCreators,
    loading: loadingSlice.actions,
    effect: sagaSlice.actionCreators
  }

  const reducer = {
    ...reducerMap,
    loading: loadingSlice.reducer
  }

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({thunk: false}).concat(thunkMiddleware, SagaMiddleware)
    }
  });

  const rootSaga = createRootSaga(sagaSlice.effects, store.getState)
  SagaMiddleware.run(rootSaga)

  type State = {
    [P in keyof T]: ReturnType<T[P]["reducer"]>
  } & {
    loading: LoadingState
  }


  const useDispatch = () => useAppDispatch<Dispatch>()
  const useSelector: TypedUseSelectorHook<State> = useAppSelector

  return {
    store,
    actionCreators: actionCreators as FinnalActionCreators,
    useDispatch,
    useSelector
  }
}
