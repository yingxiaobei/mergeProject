import { message } from 'antd';
import axios from 'axios';
import { Auth, handleLogout, _get } from 'utils';
import { PUBLIC_PREFIX } from 'constants/env';

const md5 = require('md5');

const service = axios.create({
  baseURL: process.env.NODE_ENV !== 'development' ? PUBLIC_PREFIX : '/local',
  withCredentials: true,
  // timeout: 60000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    config.withCredentials = true;
    // Do something before request is sent
    const timestamp = Date.now();
    let signArr: string[] = [];
    if (config.data) {
      signArr = Object.keys(config.data)
        .sort()
        .reduce((p: string[], c) => {
          if (typeof config.data[c] === 'object') {
            p.push(`${c}=${JSON.stringify(config.data[c])}`);
          } else if (config.data[c] !== undefined) {
            p.push(`${c}=${config.data[c]}`);
          }
          return p;
        }, []);
    }
    signArr.push(`key=${timestamp}`);
    const sign = md5(signArr.join('&')).toUpperCase();
    config.params = {
      ...config.params,
      ts: timestamp,
      sign,
      user: 'wellcom',
    };
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    const status = _get(response, 'status');
    const withFeedback = _get(response, 'config.headers.withFeedback');
    const withFailedFeedback = _get(
      response,
      'config.headers.withFailedFeedback'
    );
    const method = _get(response, 'config.method');
    // const history = useHistory();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (status === 401) {
      message.error('登录信息过期，请重新登录');
      Auth.del();
      return response.data;
    }
    if (status === 404) {
      message.error('登录信息过期，请重新登录');
      Auth.del();
      // browserHistory.push(`/mock`);
      return response.data;
    }
    if (
      withFailedFeedback ||
      withFeedback ||
      method === 'delete' ||
      method === 'put'
    ) {
      if (_get(response, 'data.success')) {
        !withFailedFeedback && message.success(_get(response, 'data.msg'));
      } else {
        message.error(_get(response, 'data.msg'));
      }
    }

    return response.data;
  },
  function (error) {
    message.error(_get(error, 'response.data.msg') || error.message);
    // handleLogout();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (_get(error, 'response.status') === 401) {
      message.error('登录信息过期，请重新登录');
      handleLogout();
    }

    return Promise.reject(error);
  }
);

interface IPayload {
  withFeedback?: boolean;
  withFailedFeedback?: boolean;
  customHeader?: any;
  responseType?:
    | 'json'
    | 'arraybuffer'
    | 'stream'
    | 'document'
    | 'text'
    | 'blob';
  bodyType?: any;
  hasHeader?: boolean;
  mustAuthenticated?: boolean;
  timeout?: any;
}

type IMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export function request(
  path: string,
  method: IMethod = 'GET',
  query: { [key: string]: any } = {},
  payload?: IPayload
) {
  const withFeedback = _get(payload, 'withFeedback', false); // 是否对接口结果进行反馈
  const withFailedFeedback = _get(payload, 'withFailedFeedback', false); // 是否仅对接口结果进行反馈
  const customHeader = _get(payload, 'customHeader', {}); // 自定义Header
  const responseType = _get(payload, 'responseType', 'json');
  const bodyType = _get(payload, 'bodyType', 'x-www-form-urlencoded');
  const hasHeader = _get(payload, 'hasHeader', true);
  const mustAuthenticated = _get(payload, 'mustAuthenticated', true); // 接口是否必须在授权后才可以调用
  const timeout = _get(payload, 'timeout', 60000);

  const headers = { withFeedback, withFailedFeedback };

  if (Auth.isAuthenticated() && hasHeader) {
    Object.assign(headers, {
      'JP-Auth-Token': Auth.get('token'),
    });
  }

  Object.assign(headers, customHeader);

  // TODO:可能还需要其他处理
  if (mustAuthenticated && !Auth.isAuthenticated()) {
    // debugger;
    return;
  }

  if (method === 'GET') {
    return service({
      url: path,
      method: method.toLowerCase() as IMethod,
      params: trimStr(query),
      headers,
      responseType,
      timeout,
    });
  }

  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    let data = trimStr(query);

    const formData = new FormData();
    if (bodyType === 'form-data') {
      for (let key of Object.keys(query)) {
        formData.append(key, query[key]);
      }
      data = formData;
    }

    return service({
      url: path,
      method: method.toLowerCase() as IMethod,
      data,
      headers,
      responseType,
      timeout,
    });
  }
}

// 用于trim字符串参数
// TODO: 支持trim数组对象类型里面的成员
function trimStr(query: any) {
  const newQuery: any = query;
  for (let key of Object.keys(newQuery)) {
    if (typeof newQuery[key] === 'string') {
      newQuery[key] = newQuery[key].trim();
    }
  }

  return newQuery;
}
