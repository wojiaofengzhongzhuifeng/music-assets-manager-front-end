import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import TableAndForm from './components/TableAndForm'
import NewVipAccountModal from './components/NewVipAccountModal'



export default () => {
  return (
    <Provider store={store}>
      <TableAndForm />
      <NewVipAccountModal />
    </Provider>
  )
}
