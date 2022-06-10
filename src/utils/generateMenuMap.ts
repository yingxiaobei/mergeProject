import { isEmpty, isArray } from 'lodash';
import { _get } from 'utils';

type TMenu = {
  children: TMenu[];
  code: string;
  parentId: string;
  title: string;
};

export function generateMenuMap(menus: TMenu[]) {
  const res: { [key: string]: string } = {};
  helper(menus);

  function helper(arr: TMenu[]) {
    for (let item of arr) {
      res[item.code] = item.title;
      if (!isEmpty(item.children)) {
        helper(item.children);
      }
    }
  }

  return res;
}

export function findFirstMenuPath(menus: any[]) {
  let res: string = '';
  helper(menus);

  function helper(arr: any[]) {
    const sortedArr = [...arr];
    sortedArr.sort((x, y) => x.orderNum - y.orderNum);

    for (let item of sortedArr) {
      if (res === '' && item.type === 'menu') {
        res = item.code;
      }

      if (res === '' && !isEmpty(item.children)) {
        helper(item.children);
      }
    }
  }

  return res;
}

interface IMenu {
  menuid: string;
  parentid: string;
  children?: Array<IMenu>;
  menuname: string;
  path: string;
}

interface IRouter {
  children?: Array<IRouter>;
  title: string;
  path: string;
  menuid: string;
}
//处理接口数据，形成菜单树
export function _treeMenu(menus: Array<IMenu>, routeList: Array<IRouter>) {
  let defaultOpenKeys = menus;

  menus?.forEach((item: IMenu, index: number) => {
    findParent(item, defaultOpenKeys) && delete defaultOpenKeys[index];
  });

  return defaultOpenKeys;
  //寻找父级菜单并挂载
  function findParent(data: IMenu, list: Array<IMenu>) {
    findPath(routeList, data);

    for (let i = 0; i < list.length; i++) {
      if (_get(list[i], 'menuid', '') === _get(data, 'parentid', '0')) {
        isArray(list[i].children) ? list[i]?.children?.push(data) : (list[i].children = [data]);
        return list;
      } else {
        isArray(_get(list[i], 'children', '')) && findParent(data, list[i]?.children || []);
      }
    }
    return false;
  }

  //本地路由根据 名字 匹配菜单
  function findPath(list: Array<IRouter>, data: IMenu) {
    list.forEach((x: IRouter) => {
      if (data.menuid === x.menuid) return (data.path = x.path);
      if (x.children) findPath(x.children, data);
    });
  }
}
