import {OtherOptions} from "./react-toolkit-plus";
import {message} from "antd";
import {Resp} from "./type";
export const options: OtherOptions = {
  globalAxiosConfig: {
    baseURL: '/api',
    timeout: 20000
  },
  checkForResponse: (resp: Resp<any>) => ({
    isSuccess: resp.msg === 'OK',
    errMsg: resp.msg === 'OK' ? '' : resp.msg
  }),
  errorBroadcaster: errMsg => message.error(errMsg)
}
