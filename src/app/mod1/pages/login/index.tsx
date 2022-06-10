import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import styles from './index.module.css';
import { _login, _ImageServlet } from './_api';
import { Auth } from 'utils';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [imgUrl, setImgUrl] = useState('');
  const navigate = useNavigate();
  const updataCode = () => {
    _ImageServlet()?.then((res: any) => {
      setImgUrl(window.URL.createObjectURL(res));
    });
  };

  useEffect(() => {
    updataCode();
  }, []);
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginDiv}>
        <div className={styles.loginTitle}>登录</div>
        <Form
          autoComplete={'off'}
          onFinish={async (value) => {
            const res: any = await _login(value);
            if (res?.success) {
              Auth.set('token', res?.token);
              Auth.set('username', res?.username);
              navigate('/');
            } else {
              message.error(res?.msg);
              updataCode();
            }
          }}
        >
          <Form.Item
            name='account'
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input placeholder='请输入用户名' className={styles.loginInput} />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              placeholder='请输入密码'
              className={styles.loginInput}
              autoComplete='new-password'
            />
          </Form.Item>

          <Form.Item
            name='vercode'
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Input
              placeholder='请输入验证码'
              suffix={
                <div>
                  <Divider type='vertical' />
                  <img
                    src={imgUrl}
                    alt='验证码'
                    className='inline-block cursor-pointer'
                    onClick={updataCode}
                  />
                </div>
              }
            />
          </Form.Item>

          <Button type='primary' htmlType='submit' className='w-full mb-2'>
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
