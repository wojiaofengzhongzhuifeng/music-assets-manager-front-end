import React, { ChangeEvent, FC, useEffect } from 'react'
import { Button, Col, Row, Table, Input, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { actionCreators, useDispatch, useSelector } from '../store'
import {
  NewVipAccountReq,
  VipAccountKey,
  VipAccount,
  UpdateVipAccountStateReq,
  VipAccountState
} from '../type'
import { AntdColumnObjItem } from '../../../../utils/type'

const { Search } = Input

const { getVipAccountList, deleteVipAccount } = actionCreators.effect
const { setNewVipAccountModal, setVipAccountSearchForm } = actionCreators.vipAccount

export const initialNewVipAccount: NewVipAccountReq = {
  email: ''
}

const TableAndForm: FC = () => {
  const dispatch = useDispatch()
  const { vipAccountList, isFetchingVipAccountList, vipAccountSearchForm, accountListTotal, isDeletingVipAccount } =
    useSelector(state => {
      return {
        vipAccountList: state.vipAccount.vipAccountList,
        isFetchingVipAccountList: state.loading.effects.getVipAccountList,
        vipAccountSearchForm: state.vipAccount.vipAccountSearchForm,
        accountListTotal: state.vipAccount.accountListTotal,
        isDeletingVipAccount: state.loading.effects.deleteVipAccount
      }
    })

  const onInputSearchUrl = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setVipAccountSearchForm({ email: e.target.value }))
  }
  const onDelEmail = (record: VipAccount) => {
    const deleteVipAccountReqData: UpdateVipAccountStateReq = {
      id: record.id,
      state: VipAccountState.off
    }
    dispatch(deleteVipAccount(deleteVipAccountReqData))
  }
  const onAddVipAccount = () => {
    dispatch(setNewVipAccountModal(initialNewVipAccount))
  }
  const onChangePage = (newPage: number, newPageSize: number) => {
    const { page: oldPage, pageSize: oldPageSize } = vipAccountSearchForm
    if (Number(oldPageSize) !== Number(newPageSize)) {
      dispatch(setVipAccountSearchForm({ pageSize: newPageSize }))
    } else if (Number(oldPage) !== Number(newPage)) {
      dispatch(setVipAccountSearchForm({ page: newPage }))
    }
  }

  useEffect(() => {
    dispatch(getVipAccountList(vipAccountSearchForm))
  }, [dispatch, vipAccountSearchForm])

  const vipAccountListColumns: AntdColumnObjItem<VipAccount>[] = [
    {
      title: 'E-MAIL',
      width: 200,
      dataIndex: VipAccountKey.email,
    },
    {
      title: 'Delete',
      width: 200,
      render: (record: VipAccount) => {
        return (
          <Popconfirm
            title="Are you sure to delete this e-mail?"
            onConfirm={() => {
              onDelEmail(record)
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        )
      }
    }
  ]
  const { email, pageSize, page } = vipAccountSearchForm

  return (
    <div>
      <h2>VipAccounts list</h2>
      <Row style={{ padding: '24px 0' }} gutter={40}>
        <Col span={12}>
          <Button onClick={onAddVipAccount} type="primary">
            {' '}
            + Add New
          </Button>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Search value={email} onChange={onInputSearchUrl} />
        </Col>
      </Row>

      <Table
        dataSource={vipAccountList}
        loading={isFetchingVipAccountList || isDeletingVipAccount}
        rowKey={VipAccountKey.id}
        columns={vipAccountListColumns}
        pagination={{
          pageSize: pageSize,
          current: page,
          total: accountListTotal,
          onChange: onChangePage
        }}
      />
    </div>
  )
}

export default TableAndForm
