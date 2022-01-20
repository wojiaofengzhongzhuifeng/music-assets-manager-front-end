import {all, call, put, race, take, takeEvery, takeLeading} from 'redux-saga/effects'
import {AnyAction} from 'redux'

const showLoading = (payload: string) => ({
  type: 'loading/SHOW_LOADING',
  payload
})

const hideLoading = (payload: string) => ({
  type: 'loading/HIDE_LOADING',
  payload
})

export default function createRootSaga(sliceSaga: any, getState: () => any) {
  return function* rootSaga() {
    const keys = Object.keys(sliceSaga)
    const effects: { [key: string]: any } = {}
    const effectsArr = []

    if (keys.length) {
      for (const key of keys) {
        const pollingRge = /.+_POLLING$/
        const isPollingEffect = pollingRge.test(key)
        if (isPollingEffect) {
          effectsArr.push(
            (function* pollingWatcher() {
              while (true) {
                const action: { type: any; payloay?: any } = yield take(`@EFFECT/${key}`)
                yield race({
                  task: call(function* () {
                    yield put(showLoading(key))
                    yield call((sliceSaga as any)[key], action)
                  } as any),
                  cancel: take(`@EFFECT/CANCEL_${key}`)
                })
              }
            })()
          )

          effectsArr.push(
            (function* canclePollingWatcher() {
              yield takeLeading(`@EFFECT/CANCEL_${key}`, function* () {
                yield put(hideLoading(key))
              })
            })()
          )
        } else {
          effects[key] = function* wrapper(action: AnyAction) {
            const meta = action.meta
            yield put(showLoading(key))
            const result: { dataSource: any, successHandler: any } = yield sliceSaga[key](action, getState())
            const {
              dataSource,
              successHandler
            } = result

            const response: object | Error = yield dataSource()
            const isSuccess = !(response instanceof Error)
            if (isSuccess) {
              const error: Error = yield successHandler(response)
              // 目前因为无法捕获到 successHandler 这个 generator 里面的错误，只能让使用者显式返回错误
              if (error instanceof Error) {
                yield put({
                  type: `@EFFECT/${key}_FAILURE`,
                  payload: error.message,
                  error: true,
                  meta,
                })
              } else {
                yield put({
                  type: `@EFFECT/${key}_SUCCESS`,
                  payload: response,
                  meta
                })

              }
            } else {
              yield put({
                type: `@EFFECT/${key}_FAILURE`,
                payload: (response as Error).message,
                error: true,
                meta
              })
            }

            yield put(hideLoading(key))
          }

          effectsArr.push(
            (function* normalWatcher() {
              yield takeEvery(`@EFFECT/${key}`, effects[key])
            })()
          )
        }
      }
    }

    yield all(effectsArr)
  }
}
