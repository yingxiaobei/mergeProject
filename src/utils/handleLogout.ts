// 退出登录
import { LOCAL_URL } from 'constants/env';
import { Auth } from 'utils';

export function handleLogout() {
  window.location.href = `${LOCAL_URL}/login`;
  Auth.del();
}
