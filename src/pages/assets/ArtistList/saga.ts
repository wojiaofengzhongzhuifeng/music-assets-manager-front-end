import { put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { message } from 'antd'

import { vipAccountSlice, VipAccountStore } from './reducer'
import API from './service'
import {
  GetVipAccountListResp,
  NewVipAccountReq,
  UpdateVipAccountStateReq,
  UpdateVipAccountStateResp,
  newVipAccountResp,
  GetVipAccountListReq
} from './type'

const { setVipAccountList, setNewVipAccountModal, setVipAccountSearchForm, setAccountListTotal } =
  vipAccountSlice.actions

function* refreshVipAccountList(store: VipAccountStore) {
  yield put(setVipAccountSearchForm(store.vipAccount.vipAccountSearchForm))
}

export const effects = {
  getVipAccountList(action: PayloadAction<GetVipAccountListReq>) {
    return {
      dataSource: () => API.getVipAccountList(action),
      *successHandler(resp: GetVipAccountListResp) {
        try {
          yield put(setVipAccountList(resp.result.data))
          yield put(setAccountListTotal(resp.result.total))
        } catch (error) {
          return error
        }
      }
    }
  },

  newVipAccount(action: PayloadAction<NewVipAccountReq>, state: VipAccountStore) {
    return {
      dataSource: () => API.newVipAccount(action),
      *successHandler(resp: newVipAccountResp): any {
        try {
          console.log(resp)
          message.success('Add vipAccount successfully!').then() // toast 提示成功
          yield put(setNewVipAccountModal(null)) // modal disable
          yield refreshVipAccountList(state)
        } catch (error) {
          return error
        }
      }
    }
  },

  deleteVipAccount(action: PayloadAction<UpdateVipAccountStateReq>, state: VipAccountStore) {
    return {
      dataSource: () => API.deleteVipAccount(action),
      *successHandler(resp: UpdateVipAccountStateResp): any {
        try {
          console.log(resp)
          message.success('Delete vipAccount successfully!').then()
          yield refreshVipAccountList(state)
        } catch (error) {
          return error
        }
      }
    }
  }
}
