import { request } from 'services';

interface loginType {
  account: string;
  password: string;
  vercode: string;
}
//登陆
export function _login(value: loginType) {
  return request(
    '/login.do',
    'POST',
    {
      ...value,
    },
    {
      mustAuthenticated: false,
    }
  );
}

//获取登录验证
export function _ImageServlet() {
  return request(
    '/servlet/ImageServlet',
    'GET',
    {},
    { responseType: 'blob', mustAuthenticated: false }
  );
}
