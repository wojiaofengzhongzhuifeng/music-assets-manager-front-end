/* eslint-disable-next-line */
import { makeStore } from '../../../utils/react-toolkit-plus'
import { vipAccountSlice } from './reducer'
import { effects } from './saga'

export const { store, actionCreators, useDispatch, useSelector } = makeStore({ vipAccount: vipAccountSlice }, effects)
