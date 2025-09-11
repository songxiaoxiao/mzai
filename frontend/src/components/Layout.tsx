import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  RobotOutlined,
  MessageOutlined,
  FileTextOutlined,
  CameraOutlined,
  AudioOutlined,
  CodeOutlined,
  BookOutlined,
  ScissorOutlined,
  LogoutOutlined,
  SettingOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { authAPI, userAPI } from '../services/api';
import { User } from '../types';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userResponse, pointsResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        userAPI.getPoints()
      ]);
      
      if (userResponse.data.success) {
        setUser(userResponse.data.data);
      }
      
      if (pointsResponse.success) {
        setPoints(pointsResponse.data);
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/movie-clip',
      icon: <ScissorOutlined />,
      label: '电影快剪',
    },
    {
      key: '/ai-functions',
      icon: <RobotOutlined />,
      label: 'AI功能',
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: '智能对话',
    },
    {
      key: '/text-generation',
      icon: <FileTextOutlined />,
      label: '文本生成',
    },
    {
      key: '/image-recognition',
      icon: <CameraOutlined />,
      label: '图像识别',
    },
    {
      key: '/speech-to-text',
      icon: <AudioOutlined />,
      label: '语音转文字',
    },
    {
      key: '/code-generation',
      icon: <CodeOutlined />,
      label: '代码生成',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{ 
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          backdropFilter: 'blur(15px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="custom-sider"
      >
        <div className="p-4 text-center transition-all duration-300">
          <h1 className={`text-white font-bold ${collapsed ? 'text-lg' : 'text-xl'} drop-shadow-lg transition-all duration-300`}>
            {collapsed ? 'AI' : 'AI内容创作平台'}
          </h1>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            background: 'transparent',
            border: 'none',
          }}
          className="custom-menu"
        />
      </Sider>

      <AntLayout>
        <Header 
          className="flex items-center justify-end px-6"
          style={{ 
            background: 'transparent',
            borderBottom: 'none',
            height: '64px',
          }}
        >
          <div className="flex items-center space-x-4">
            <Badge count={points} showZero>
              <Button 
                type="text" 
                icon={<WalletOutlined />} 
                className="text-gray-800 hover:text-blue-600 font-medium"
                onClick={() => navigate('/profile')}
              >
                积分
              </Button>
            </Badge>

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar 
                  src={user?.avatarUrl} 
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <span className="text-gray-800 font-medium">{user?.username}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6">
          <div className="glass rounded-lg p-6 min-h-full">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 