import React, { useState } from 'react';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import './basicLayout.css';
import Navigation from './Navigation';
import GlobalContext from 'globalContext';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Auth, handleLogout } from 'utils';

const { Header, Content } = Layout;

const BasicLayouts: React.FC = (props: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const { $menuTree } = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        className='p-0 '
        style={{
          background: 'white',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: 20, display: 'flex' }}>
          {collapsed ? (
            <MenuOutlined
              style={{ marginTop: 22 }}
              onClick={() => setCollapsed(!collapsed)}
            />
          ) : (
            <MenuFoldOutlined
              style={{ marginTop: 22 }}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <div style={{ marginLeft: 20 }}>系统mod1</div>
        </div>

        <div className='cursor-pointer flex items-center'>
          <span className='mr-2'>欢迎：{Auth.get('username')} | </span>
          <span className='ml-2' onClick={handleLogout}>
            退出
          </span>
        </div>
      </Header>

      <Layout className='site-layout h-screen'>
        <Navigation
          menu={$menuTree}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayouts;
