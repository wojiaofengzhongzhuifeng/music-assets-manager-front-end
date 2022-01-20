import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  GetVipAccountListReqKey,
  NewVipAccountReq,
  PartialGetVipAccountListReq,
  VipAccount,
  VipAccountListManagerState,
  VipAccountState
} from './type'

const initialState: VipAccountListManagerState = {
  vipAccountList: [], // 列表数据
  newVipAccountModal: null,
  vipAccountSearchForm: {
    page: 1,
    pageSize: 20,
    email: '',
    state: VipAccountState.on
  },
  accountListTotal: 0
}

export const vipAccountSlice = createSlice({
  name: 'vipAccount',
  initialState,
  reducers: {
    setVipAccountList(state, action: PayloadAction<VipAccount[]>) {
      state.vipAccountList = action.payload
    },
    setNewVipAccountModal(state, action: PayloadAction<NewVipAccountReq | null>) {
      state.newVipAccountModal = action.payload
    },
    setVipAccountSearchForm(state, action: PayloadAction<PartialGetVipAccountListReq>) {
      if (Object.keys(action.payload).length === 1 && Object.keys(action.payload)[0] !== GetVipAccountListReqKey.page) {
        // 通过这样调用 dispatch(setVipAccountSearchForm({ page: newPage })), 如果改的是非 page 的值, 会顺带将 page 设置为 1
        state.vipAccountSearchForm = {
          ...state.vipAccountSearchForm,
          ...action.payload,
          [GetVipAccountListReqKey.page]: 1
        }
      } else {
        state.vipAccountSearchForm = { ...state.vipAccountSearchForm, ...action.payload }
      }
    },
    setAccountListTotal(state, action: PayloadAction<number>) {
      state.accountListTotal = action.payload
    }
  }
})

export type VipAccountStore = {
  vipAccount: ReturnType<typeof vipAccountSlice.reducer>
}
