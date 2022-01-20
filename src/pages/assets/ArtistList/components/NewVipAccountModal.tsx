import React, { useEffect } from 'react'
import { Modal, Input, Form } from 'antd'
import { actionCreators, useDispatch, useSelector } from '../store'
import { NewVipAccountReq, NewVipAccountReqKey } from '../type'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const { newVipAccount } = actionCreators.effect
const { setNewVipAccountModal } = actionCreators.vipAccount

const NewVipAccountModal = () => {
  const [form] = Form.useForm<NewVipAccountReq>()
  const dispatch = useDispatch()
  const { newVipAccountModal, isAddingVipAccount } = useSelector(state => {
    return {
      newVipAccountModal: state.vipAccount.newVipAccountModal,
      isAddingVipAccount: state.loading.effects.newVipAccount,
    }
  })

  const onCancel = () => {
    dispatch(setNewVipAccountModal(null))
  }

  const onAddVipAccount = async () => {
    try {
      const validator = await form.validateFields()
      console.log(validator)
      const formData = form.getFieldsValue()
      const newArtistReqData: NewVipAccountReq = {
        email: formData.email
      }
      dispatch(newVipAccount(newArtistReqData))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (newVipAccountModal) {
      form.setFieldsValue(newVipAccountModal)
    }
  }, [form, newVipAccountModal])

  return (
    <Modal
      visible={newVipAccountModal !== null}
      title="Add VIP Account"
      onCancel={onCancel}
      okText="Add VIP Account"
      zIndex={1002}
      onOk={onAddVipAccount}
      confirmLoading={isAddingVipAccount}
      destroyOnClose={true}
    >
      <Form {...layout} form={form}>
        <Form.Item name={NewVipAccountReqKey.email} label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default NewVipAccountModal
