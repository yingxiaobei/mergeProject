import { Menu, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import GlobalContext from 'globalContext';

import { VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function Navigation(props: any) {
  const { collapsed, setCollapsed, menu } = props;
  const { $menuAuthTable, isLoading } = useContext(GlobalContext);

  const Redirect = useNavigate();

  const ICONS: any = {
    '0': <VideoCameraOutlined />,
    '1': <UploadOutlined />,
    '2': <VideoCameraOutlined />,
    '3': <VideoCameraOutlined />,
  };

  function transformMenu(menu: any) {
    return (menu || []).map((x: any, index: any) => {
      return {
        key: x?.id,
        icon: ICONS[index],
        label: x?.title,
        path: x?.path,
        children: x?.children.map((item: any) => {
          return {
            key: item?.id,
            label: item?.title,
            path: item?.path,
            onClick: () => {
              Redirect(item?.path);
            },
          };
        }),
      };
    });
  }
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      // breakpoint='xl'
      onBreakpoint={(broken) => {
        setCollapsed(broken);
      }}
      width={220}
    >
      <Menu
        mode='inline'
        items={transformMenu(menu)}
        defaultSelectedKeys={['system/users']}
      ></Menu>
    </Sider>
  );
}
export default Navigation;
