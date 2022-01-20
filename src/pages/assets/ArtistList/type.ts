import { Resp } from '../../../utils/type'
import { stringEnum } from '../../../utils/utils'

export enum VipAccountState {
  off,
  on
}

export interface VipAccount {
  id: number // 1,
  email: string
}
export const VipAccountKey = stringEnum<keyof VipAccount>()

export type VipAccountListManagerState = {
  vipAccountList: VipAccount[]
  newVipAccountModal: NewVipAccountReq | null
  vipAccountSearchForm: GetVipAccountListReq
  accountListTotal: number
}

export type NewVipAccountReq = {
  email: string
}
export const NewVipAccountReqKey = stringEnum<keyof NewVipAccountReq>()

export interface GetVipAccountListReq {
  page: number
  pageSize: number
  email: string
  state?: VipAccountState
}
export const GetVipAccountListReqKey = stringEnum<keyof GetVipAccountListReq>()
export type PartialGetVipAccountListReq = Partial<GetVipAccountListReq>
export type UpdateVipAccountStateReq = {
  id: number
  state: VipAccountState
}
// todo
export type GetVipAccountListResp = Resp<{ data: VipAccount[]; page: number; total: number }>
export type newVipAccountResp = Resp<string>
export type UpdateVipAccountStateResp = Resp<null>
