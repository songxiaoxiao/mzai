import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Button, Space, message, Modal } from 'antd';
import { 
  UserOutlined, 
  RobotOutlined, 
  WalletOutlined, 
  MessageOutlined,
  FileTextOutlined,
  CameraOutlined,
  AudioOutlined,
  CodeOutlined,
  BookOutlined,
  ArrowRightOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userAPI, aiAPI } from '../services/api';
import { User, AiFunctionPoints } from '../types';
import { usePoints } from '../contexts/PointsContext';
import PointsDisplay from '../components/PointsDisplay';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [functionPoints, setFunctionPoints] = useState<AiFunctionPoints>({});
  const [loading, setLoading] = useState(true);
  const { points, refreshPoints } = usePoints();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [userResponse, functionsResponse] = await Promise.all([
        userAPI.getProfile(),
        aiAPI.getFunctionPoints()
      ]);

      if (userResponse.success) {
        setUser(userResponse.data);
      }
      if (functionsResponse.success) {
        setFunctionPoints(functionsResponse.data);
      }
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 积分预检查功能
  const handleFunctionClick = (func: any) => {
    const requiredPoints = functionPoints[func.key] || 0;
    
    if (points < requiredPoints) {
      Modal.confirm({
        title: '积分不足',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>使用 <strong>{func.title}</strong> 需要 <strong>{requiredPoints}</strong> 积分</p>
            <p>您当前只有 <strong>{points}</strong> 积分</p>
            <p>是否前往充值页面？</p>
          </div>
        ),
        onOk() {
          navigate('/profile'); // 假设个人中心有充值功能
        },
        okText: '去充值',
        cancelText: '取消',
      });
      return;
    }
    
    // 积分足够，跳转到功能页面
    navigate(func.path);
  };

  const aiFunctions = [
    {
      key: 'chat',
      title: '智能对话',
      icon: <MessageOutlined className="text-2xl" />,
      description: '与AI助手进行智能对话',
      color: 'from-blue-500 to-blue-600',
      path: '/chat'
    },
    {
      key: 'text-generation',
      title: '文本生成',
      icon: <FileTextOutlined className="text-2xl" />,
      description: '生成创意文本内容',
      color: 'from-green-500 to-green-600',
      path: '/text-generation'
    },
    {
      key: 'image-recognition',
      title: '图像识别',
      icon: <CameraOutlined className="text-2xl" />,
      description: '识别图像中的内容',
      color: 'from-purple-500 to-purple-600',
      path: '/image-recognition'
    },
    {
      key: 'speech-to-text',
      title: '语音转文字',
      icon: <AudioOutlined className="text-2xl" />,
      description: '将语音转换为文字',
      color: 'from-orange-500 to-orange-600',
      path: '/speech-to-text'
    },
    {
      key: 'code-generation',
      title: '代码生成',
      icon: <CodeOutlined className="text-2xl" />,
      description: '根据需求生成代码',
      color: 'from-red-500 to-red-600',
      path: '/code-generation'
    },
    {
      key: 'document-summary',
      title: '文档总结',
      icon: <BookOutlined className="text-2xl" />,
      description: '智能总结文档内容',
      color: 'from-indigo-500 to-indigo-600',
      path: '/document-summary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="text-center mb-8">
        <Title level={1} className="gradient-text mb-2">
          欢迎回来，{user?.fullName || user?.username}！
        </Title>
        <Text type="secondary" className="text-lg">
          探索AI的无限可能，开启智能新时代
        </Text>
      </div>

      {/* 积分显示 */}
      <div className="mb-8">
        <PointsDisplay 
          showDetails={true}
          showProgress={true}
          size="large"
        />
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <Card className="glass card-hover">
            <Statistic
              title="AI功能"
              value={aiFunctions.length}
              prefix={<RobotOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="glass card-hover">
            <Statistic
              title="账户状态"
              value="活跃"
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="glass card-hover">
            <Statistic
              title="使用次数"
              value={Math.floor(points / 10)}
              prefix={<MessageOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* AI功能网格 */}
      <div>
        <Title level={3} className="mb-6 text-white">
          AI功能中心
        </Title>
        <Row gutter={[16, 16]}>
          {aiFunctions.map((func) => (
            <Col xs={24} sm={12} lg={8} key={func.key}>
              <Card 
                className="glass card-hover cursor-pointer"
                onClick={() => handleFunctionClick(func)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${func.color} rounded-lg flex items-center justify-center text-white`}>
                      {func.icon}
                    </div>
                    <div>
                      <Title level={4} className="mb-1 text-white">
                        {func.title}
                      </Title>
                      <Text type="secondary" className="text-sm">
                        {func.description}
                      </Text>
                      <div className="mt-2 flex items-center justify-between">
                        <Text type="secondary" className="text-xs">
                          消耗积分: {functionPoints[func.key] || 0}
                        </Text>
                        {points < (functionPoints[func.key] || 0) && (
                          <span className="text-red-500 text-xs font-semibold">
                            积分不足
                          </span>
                        )}
                        {points >= (functionPoints[func.key] || 0) && (
                          <span className="text-green-500 text-xs font-semibold">
                            可使用
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRightOutlined className="text-gray-400" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 快速操作 */}
      <div className="mt-8">
        <Title level={3} className="mb-6 text-white">
          快速操作
        </Title>
        <Space size="large" wrap>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/profile')}
            className="btn-primary"
          >
            个人中心
          </Button>
          <Button 
            size="large"
            onClick={() => navigate('/ai-functions')}
            className="btn-secondary"
          >
            查看所有功能
          </Button>
          <Button 
            size="large"
            icon={<WalletOutlined />}
            onClick={() => navigate('/transaction-history')}
            className="btn-secondary"
          >
            积分历史
          </Button>
        </Space>
      </div>

      {/* 积分使用建议 */}
      {points < 50 && (
        <Card className="glass border-orange-200 bg-orange-50">
          <div className="flex items-center space-x-3">
            <WalletOutlined className="text-orange-500 text-xl" />
            <div>
              <Title level={4} className="text-orange-800 mb-1">
                积分不足提醒
              </Title>
              <Text className="text-orange-700">
                您的积分余额较低，建议及时充值以继续使用AI功能。
              </Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard; 