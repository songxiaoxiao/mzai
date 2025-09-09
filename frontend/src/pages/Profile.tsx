import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Avatar, Row, Col, Statistic, message, Tabs } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, WalletOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { userAPI } from '../services/api';
import { User } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userResponse, pointsResponse] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getPoints()
      ]);

      if (userResponse.data.success) {
        setUser(userResponse.data.data);
        form.setFieldsValue(userResponse.data.data);
      }
      if (pointsResponse.data.success) {
        setPoints(pointsResponse.data.data);
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    }
  };

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(values);
      if (response.data.success) {
        setUser(response.data.data);
        setEditing(false);
        message.success('个人信息更新成功！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = () => {
    message.info('充值功能开发中，请联系管理员');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          个人中心
        </Title>
        <Text type="secondary">
          管理您的个人信息和账户设置
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* 个人信息 */}
        <Col xs={24} lg={16}>
          <Card className="glass">
            <div className="flex justify-between items-center mb-6">
              <Title level={3}>个人信息</Title>
              <Button
                type={editing ? 'default' : 'primary'}
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
                onClick={() => setEditing(!editing)}
              >
                {editing ? '保存' : '编辑'}
              </Button>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input prefix={<UserOutlined />} disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fullName"
                    label="姓名"
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="手机号"
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              {editing && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn-primary"
                  >
                    保存更改
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>

        {/* 账户信息 */}
        <Col xs={24} lg={8}>
          <Card className="glass">
            <div className="text-center mb-6">
              <Avatar
                size={80}
                src={user?.avatarUrl}
                icon={<UserOutlined />}
                className="mb-4"
              />
              <Title level={4}>{user?.fullName || user?.username}</Title>
              <Text type="secondary">@{user?.username}</Text>
            </div>

            <div className="space-y-4">
              <Statistic
                title="当前积分"
                value={points}
                prefix={<WalletOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              
              <Button
                type="primary"
                block
                onClick={handleRecharge}
                className="btn-primary"
              >
                充值积分
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 账户统计 */}
      <Card className="glass">
        <Title level={3} className="mb-6">账户统计</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="注册时间"
              value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="账户状态"
              value={user?.isActive ? '活跃' : '禁用'}
              valueStyle={{ color: user?.isActive ? '#52c41a' : '#ff4d4f' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="用户角色"
              value={user?.role === 'ADMIN' ? '管理员' : '普通用户'}
              valueStyle={{ fontSize: '16px' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 使用记录 */}
      <Card className="glass">
        <Tabs defaultActiveKey="1">
          <TabPane tab="使用记录" key="1">
            <div className="text-center py-8">
              <Text type="secondary">使用记录功能开发中...</Text>
            </div>
          </TabPane>
          <TabPane tab="积分记录" key="2">
            <div className="text-center py-8">
              <Text type="secondary">积分记录功能开发中...</Text>
            </div>
          </TabPane>
          <TabPane tab="设置" key="3">
            <div className="text-center py-8">
              <Text type="secondary">设置功能开发中...</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile; 