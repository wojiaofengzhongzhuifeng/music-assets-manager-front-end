// 保存工具函数



// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/naming-convention
import {StringEnum} from "./type";

export function _Boolean(data: any) {
  if (data === 0) {
    return true
  }
  if (data instanceof Array) {
    return data?.length !== 0
  }
  if (data instanceof Object) {
    return Object.keys(data).length !== 0
  }
  return Boolean(data)
}
export function filterFalsyValue<T>(obj: T) {
  const copyObj = { ...obj }
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    const value = obj[key]
    if (!_Boolean(value)) {
      // @ts-ignore
      delete copyObj[key]
    }
  })
  return copyObj
}



const proxy = new Proxy(
  {},
  {
    get(target, property) {
      return property
    }
  }
)
export function stringEnum<T extends string>(): StringEnum<T> {
  return proxy as StringEnum<T>
}
/*
interface Song{
  a: string
  b: number
}
// define
const SongKey = stringEnum<keyof Song>();
// usage
console.log(SongKey.b);
* */

// todo
export function pickKeyFromObj(obj: { [key: string]: any }, keyList: any[]): { [key: string]: string } {
  // @ts-ignore
  const result: { [key: string]: any } = null
  Object.keys(obj).forEach(key => {
    if (keyList.includes(key)) {
      result[key] = obj[key]
    }
  })
  return result
}
