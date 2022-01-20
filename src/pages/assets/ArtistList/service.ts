import { serviceWrapper } from '../../../utils/react-toolkit-plus'
import { PayloadAction } from '@reduxjs/toolkit'
import { options } from '../../../utils/request'
import { NewVipAccountReq, UpdateVipAccountStateReq, GetVipAccountListReq } from './type'
import { filterFalsyValue } from '../../../utils/utils'

const { api: API, axiosInstance } = serviceWrapper(
  {
    getVipAccountList(action: PayloadAction<GetVipAccountListReq>) {
      const searchFormWithoutFalsy = filterFalsyValue<GetVipAccountListReq>(action.payload)
      return {
        url: '/url/surf-bm/user-vip/list',
        method: 'POST',
        data: searchFormWithoutFalsy
      }
    },
    newVipAccount(action: PayloadAction<NewVipAccountReq>) {
      return {
        url: '/url/surf-bm/user-vip/add',
        method: 'POST',
        data: action.payload
      }
    },
    deleteVipAccount(action: PayloadAction<UpdateVipAccountStateReq>) {
      return {
        url: '/url/surf-bm/user-vip/update',
        method: 'POST',
        data: action.payload
      }
    }
  },
  options
)

// axiosInstance.interceptors.request.use(setAuthMiddleWare)
export default API
