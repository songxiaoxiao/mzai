import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, RobotOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { RegisterRequest } from '../types';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authAPI.register(values);
      
      if (response.data.success) {
        message.success('注册成功！请登录');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '注册失败，请检查输入信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md">
        <Card className="glass shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <RobotOutlined className="text-white text-2xl" />
              </div>
            </div>
            <Title level={2} className="gradient-text mb-2">
            AI内容创作平台
            </Title>
            <Text type="secondary" className="text-lg">
              创建您的账户，开启AI之旅
            </Text>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名！' },
                { min: 3, max: 20, message: '用户名长度必须在3-20个字符之间！' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
                className="input-field"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱！' },
                { type: 'email', message: '请输入有效的邮箱地址！' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="邮箱"
                className="input-field"
              />
            </Form.Item>

            <Form.Item
              name="fullName"
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="姓名（可选）"
                className="input-field"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="手机号（可选）"
                className="input-field"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, message: '密码至少6个字符！' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
                className="input-field"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致！'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="确认密码"
                className="input-field"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="btn-primary w-full h-12 text-lg"
              >
                注册
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type="secondary">或者</Text>
          </Divider>

          <div className="text-center">
            <Text type="secondary">
              已有账户？{' '}
              <Link 
                to="/login" 
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                立即登录
              </Link>
            </Text>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary" className="text-sm">
            © 2024 AI内容创作平台. 高端科技，智能未来.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Register; 