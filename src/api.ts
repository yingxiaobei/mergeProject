import { request } from 'services';

export async function _queryMenuTreeInfo() {
  return await request('/code/queryMenuTreeInfo', 'POST');
}
