import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosInstance } from 'axios'
import qs from 'qs'

export type IRequestOptinos = AxiosRequestConfig

const MAP_CODE_2_TEXT = {
  '400': 'Oops, 400 bad request!',
  '401': 'Token error ! First try to log in again, if you still get an error, please contact the administrator.', // 要么用户没有登录，要么就是登录token过期了
  '403': 'For the current operation, you do not have sufficient permissions, access is denied.', // 用户登录了，但是当前身份权限不够，被禁止访问
  '404': 'Client error, URL is not found on server.', // 请求的 api url错误
  '5xx': 'Server internal error, please retry later.' // 500系列采用同一个提示
} as const

type HTTPStatusCode = keyof typeof MAP_CODE_2_TEXT

type CheckForResponse<R = any> = (resp: R) => { isSuccess: boolean, errMsg: string }

type ErrorBroadcaster = (errMsg:string) => any

function formatErrorMsg(originMsg: string, serviceName: string) {
  if (serviceName) {
    return `Error from「${serviceName}」service：${originMsg}`
  } else {
    return originMsg
  }
}


export function request<R>(
  instance: AxiosInstance,
  config: AxiosRequestConfig,
  otherOptions: {
    showError: boolean,
    serviceName: string,
    checkForResponse: CheckForResponse<R>,
    errorBroadcaster: ErrorBroadcaster
  }
) {

  const {
    showError,
    serviceName,
    checkForResponse,
    errorBroadcaster
  } = otherOptions

  return new Promise<R | Error>(resolve => {
    instance
      .request(config)
      .then((json: AxiosResponse<R>) => {
        const checkResult = checkForResponse(json.data)
        if (checkResult.isSuccess) {
          resolve(json.data)
        } else {
          if (showError) {
            errorBroadcaster(formatErrorMsg(checkResult.errMsg, serviceName!))
          }
          resolve(new Error(checkResult.errMsg))
        }
      })
      .catch((err: AxiosError) => {
        console.log("🚀 ~ file: request.ts ~ line 69 ~ request ~ err：", err)
        const httpStatusCode = err.response?.status
        let errMsg = ''

        if (httpStatusCode !== undefined) {
          const statusCodeStr = httpStatusCode >= 500 ? '5xx' : String(httpStatusCode)
          errMsg = MAP_CODE_2_TEXT[statusCodeStr as HTTPStatusCode]
        } else if (err.code === 'ECONNABORTED') {
          errMsg = 'Network request timeout,please retry later.'
        } else if (err.code === undefined) {
          errMsg = 'Network connect error,please check if you are online.'
        } else {
          errMsg = err.message
        }

        if (showError && !axios.isCancel(err)) {
          errorBroadcaster(formatErrorMsg(errMsg, serviceName!))
        }
        resolve(new Error(errMsg))
      })
  })
}

type ValidAxiosRequestConfig = AxiosRequestConfig & {
  method: string,
  url: string
}

export type ServiceCreatorReturnValue = ValidAxiosRequestConfig & {
  otherOptions?: { showError?: boolean, checkForResponse?: CheckForResponse }
}

export type ServiceMap = {
  [serviceName: string]: (...args: any[]) => ServiceCreatorReturnValue
}

export type OtherOptions = {
  globalAxiosConfig?: AxiosRequestConfig,
  checkForResponse: (resp: any) => { isSuccess: boolean, errMsg: string },
  errorBroadcaster: ErrorBroadcaster
}

type OriginSeiviceMap<T extends ServiceMap, R> = {
  [P in keyof T]: (...args: Parameters<T[P]>) => Promise<R | Error>
}

type ResponseData<T> = T extends {
  globalAxiosConfig?: AxiosRequestConfig,
  checkForResponse: (resp: infer R) => { isSuccess: boolean, errMsg: string }
} ? R : any

// @TODO: 为什么 serviceMap 实参得不到有效的约束，具体可以根据我在 stackoverflow 上提的问题
// @see: https://stackoverflow.com/questions/70122705/when-all-the-key-in-interface-is-optional-in-typescript-an-unexpected-field-pro
export function serviceWrapper<T extends ServiceMap, O extends OtherOptions>(
  serviceMap: T,
  otherOptions: O
): {
  api: OriginSeiviceMap<T, ResponseData<O>>,
  axiosInstance: AxiosInstance
} {
  const {
    globalAxiosConfig,
    checkForResponse: globalCheckForResponse,
    errorBroadcaster
  } = otherOptions

  const instance = axios.create(globalAxiosConfig || {})
  instance.interceptors.request.use(config => {
    config.withCredentials = true

    // 应对请求方法为 “get”，参数为数组的情况。
    // 举个例子，如果你的参数是数组类型：“arr=[1,2,3]”，这里的代码就会将它序列化为 “arr=1&arr=2&arr=3”
    if (config.method?.toLowerCase() === 'get') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    return config
  })

  const wrapper = {} as OriginSeiviceMap<T, ResponseData<O>>
  const entries = Object.entries(serviceMap)


  for (const [serviceName, configFn] of entries) {
    wrapper[serviceName as keyof T] = (...args: any[]) => {
      const { otherOptions, ...axiosRequestConfig } = configFn(...args)
      let iShowError = true
      if (otherOptions?.showError === false) {
        iShowError = false
      }

      return request<ResponseData<O>>(
        instance,
        axiosRequestConfig,
        {
          showError: iShowError,
          serviceName,
          checkForResponse: otherOptions?.checkForResponse || globalCheckForResponse,
          errorBroadcaster
        })
    }
  }

  return {
    api: wrapper,
    axiosInstance: instance
  }
}


