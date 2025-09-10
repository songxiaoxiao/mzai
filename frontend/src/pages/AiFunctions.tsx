import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Modal, message } from 'antd';
import { 
  MessageOutlined, 
  FileTextOutlined, 
  CameraOutlined, 
  AudioOutlined, 
  CodeOutlined, 
  BookOutlined,
  ScissorOutlined,
  ArrowRightOutlined,
  RobotOutlined,
  ExclamationCircleOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { AiFunctionPoints } from '../types';
import { usePoints } from '../contexts/PointsContext';

const { Title, Text } = Typography;

const AiFunctions: React.FC = () => {
  const navigate = useNavigate();
  const [functionPoints, setFunctionPoints] = useState<AiFunctionPoints>({});
  const [loading, setLoading] = useState(true);
  const { points: userPoints } = usePoints();

  useEffect(() => {
    fetchFunctionPoints();
  }, []);

  const fetchFunctionPoints = async () => {
    try {
      const response = await aiAPI.getFunctionPoints();
      if (response.success) {
        setFunctionPoints(response.data);
      }
    } catch (error) {
      console.error('获取功能积分失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 积分预检查功能
  const handleUseFunction = (func: any) => {
    const requiredPoints = functionPoints[func.key] || 0;
    
    if (userPoints < requiredPoints) {
      Modal.confirm({
        title: '积分不足',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>功能名称:</span>
              <strong>{func.title}</strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>需要积分:</span>
              <strong className="text-blue-600">{requiredPoints}</strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>当前积分:</span>
              <strong className="text-red-500">{userPoints}</strong>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>还需积分:</span>
              <strong className="text-orange-500">{requiredPoints - userPoints}</strong>
            </div>
            <p className="text-center mt-4">是否前往个人中心充值？</p>
          </div>
        ),
        onOk() {
          navigate('/profile');
        },
        okText: '去充值',
        cancelText: '取消',
        width: 400,
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
      icon: <MessageOutlined className="text-3xl" />,
      description: '与AI助手进行智能对话，获取专业建议和帮助',
      color: 'from-blue-500 to-blue-600',
      path: '/chat',
      features: ['自然语言交互', '多轮对话', '智能回答']
    },
    {
      key: 'text-generation',
      title: '文本生成',
      icon: <FileTextOutlined className="text-3xl" />,
      description: '基于您的输入，AI将生成创意文本内容',
      color: 'from-green-500 to-green-600',
      path: '/text-generation',
      features: ['创意写作', '文案生成', '内容创作']
    },
    {
      key: 'image-recognition',
      title: '图像识别',
      icon: <CameraOutlined className="text-3xl" />,
      description: '上传图片，AI将识别图像中的内容并为您提供详细描述',
      color: 'from-purple-500 to-purple-600',
      path: '/image-recognition',
      features: ['物体识别', '场景分析', '文字识别']
    },
    {
      key: 'speech-to-text',
      title: '语音转文字',
      icon: <AudioOutlined className="text-3xl" />,
      description: '将语音内容转换为文字，支持多种语言识别',
      color: 'from-orange-500 to-orange-600',
      path: '/speech-to-text',
      features: ['高精度识别', '多语言支持', '实时转换']
    },
    {
      key: 'code-generation',
      title: '代码生成',
      icon: <CodeOutlined className="text-3xl" />,
      description: '描述您的需求，AI将为您生成相应的代码',
      color: 'from-red-500 to-red-600',
      path: '/code-generation',
      features: ['多语言支持', '智能生成', '代码优化']
    },
    {
      key: 'movie-clip',
      title: '电影快剪',
      icon: <ScissorOutlined className="text-3xl" />,
      description: '使用AI智能剪辑您的视频，快速生成精彩片段',
      color: 'from-pink-500 to-pink-600',
      path: '/movie-clip',
      features: ['智能分析', '自动剪辑', '快速导出']
    }
  ];

  return (
    <div className="space-y-6">
      {/* 用户积分显示 */}
      <Card className="glass">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="gradient-text mb-2">
              AI功能中心
            </Title>
            <Text type="secondary" className="text-lg">
              探索我们提供的各种AI功能，助力您的工作和生活
            </Text>
          </div>
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-2">
              <WalletOutlined className="text-blue-500 text-xl" />
              <Title level={3} className="mb-0 text-blue-600">
                {userPoints}
              </Title>
            </div>
            <Text type="secondary">当前积分</Text>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {aiFunctions.map((func) => (
          <Col xs={24} sm={12} lg={8} key={func.key}>
            <Card 
              className="glass card-hover h-full"
              hoverable
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${func.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {func.icon}
                </div>
                <Title level={3} className="mb-2">
                  {func.title}
                </Title>
                <Text type="secondary" className="block mb-4">
                  {func.description}
                </Text>
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Tag color={userPoints >= (functionPoints[func.key] || 0) ? "green" : "red"}>
                      消耗积分: {functionPoints[func.key] || 0}
                    </Tag>
                    {userPoints >= (functionPoints[func.key] || 0) ? (
                      <Tag color="success">可使用</Tag>
                    ) : (
                      <Tag color="error">积分不足</Tag>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Text strong className="block mb-2">功能特点：</Text>
                <div className="space-y-1">
                  {func.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="primary"
                block
                icon={<ArrowRightOutlined />}
                onClick={() => handleUseFunction(func)}
                className="btn-primary"
                disabled={userPoints < (functionPoints[func.key] || 0)}
              >
                {userPoints >= (functionPoints[func.key] || 0) ? '立即使用' : '积分不足'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 使用指南 */}
      <Card className="glass">
        <Title level={3} className="mb-6">
          <RobotOutlined className="mr-2" />
          使用指南
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <Title level={5}>选择功能</Title>
              <Text type="secondary">根据您的需求选择合适的AI功能</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <Title level={5}>输入内容</Title>
              <Text type="secondary">按照提示输入您的内容或上传文件</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <Title level={5}>获取结果</Title>
              <Text type="secondary">AI将为您生成相应的结果</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 积分说明 */}
      <Card className="glass">
        <Title level={3} className="mb-4">
          积分说明
        </Title>
        <div className="space-y-3">
          <Text>• 每个AI功能都有相应的积分消耗</Text>
          <Text>• 新用户注册可获得100积分</Text>
          <Text>• 积分不足时无法使用AI功能</Text>
          <Text>• 可通过充值获得更多积分</Text>
        </div>
      </Card>
    </div>
  );
};

export default AiFunctions; 