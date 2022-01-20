import { ColumnType } from 'antd/lib/table/interface'

// 保存公共类型函数与公共类型
export interface Resp<T> {
  code: number
  msg: string
  result: T
}
export type Modify<T, R> = Omit<T, keyof R> & R
export type AntdColumnObjItem<T> = Modify<{ [key in keyof ColumnType<T>]?: any }, { dataIndex?: keyof T }>
export type PartialWithRequire<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>
export type StringEnum<T extends string> = { [K in T]: K }


