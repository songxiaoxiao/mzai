import React, { useState } from 'react';
import { Button, Card, Typography, message, Space } from 'antd';
import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;

const SpeechToText: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    message.info('开始录音，请说话...');
    // 这里应该实现实际的录音功能
    // 由于浏览器限制，需要用户授权
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setLoading(true);
    
    try {
      // 模拟语音转文字
      const mockAudioData = "模拟的语音数据";
      const response = await aiAPI.processFunction('speech-to-text', mockAudioData);
      
      if (response.success) {
        setTranscript(response.data);
        message.success('语音转文字完成！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '转换失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          语音转文字
        </Title>
        <Text type="secondary">
          将语音内容转换为文字，支持多种语言识别
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 录音区域 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            录音控制
          </Title>
          
          <div className="text-center py-8">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-blue-500'
            }`}>
              {isRecording ? (
                <StopOutlined className="text-white text-3xl" />
              ) : (
                <AudioOutlined className="text-white text-3xl" />
              )}
            </div>
            
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<AudioOutlined />}
                onClick={handleStartRecording}
                disabled={isRecording}
                className="btn-primary"
              >
                开始录音
              </Button>
              <Button
                danger
                size="large"
                icon={<StopOutlined />}
                onClick={handleStopRecording}
                disabled={!isRecording}
                loading={loading}
              >
                停止录音
              </Button>
            </Space>
            
            <div className="mt-4">
              <Text type="secondary">
                {isRecording ? '正在录音...' : '点击开始录音按钮开始'}
              </Text>
            </div>
          </div>
        </Card>

        {/* 转换结果 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            转换结果
          </Title>
          
          {transcript ? (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <Paragraph className="whitespace-pre-wrap text-gray-800">
                {transcript}
              </Paragraph>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <AudioOutlined className="text-4xl mb-2" />
                <Text type="secondary">
                  转换结果将显示在这里
                </Text>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-4 text-center">
              <div className="loading-spinner mx-auto mb-2"></div>
              <Text type="secondary">正在转换中...</Text>
            </div>
          )}
        </Card>
      </div>

      {/* 使用说明 */}
      <Card className="glass">
        <Title level={4} className="mb-4">
          使用说明
        </Title>
        <div className="space-y-2 text-sm text-gray-600">
          <Text>• 点击"开始录音"按钮开始录音</Text>
          <Text>• 说话时请保持清晰的发音</Text>
          <Text>• 点击"停止录音"按钮结束录音并开始转换</Text>
          <Text>• 支持中文、英文等多种语言</Text>
          <Text>• 每次转换将消耗相应积分</Text>
        </div>
      </Card>

      {/* 功能特点 */}
      <Card className="glass">
        <Title level={4} className="mb-4">
          功能特点
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <AudioOutlined className="text-2xl text-blue-500 mb-2" />
            <Title level={5}>高精度识别</Title>
            <Text type="secondary">采用先进的语音识别技术</Text>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <AudioOutlined className="text-2xl text-green-500 mb-2" />
            <Title level={5}>多语言支持</Title>
            <Text type="secondary">支持中文、英文等多种语言</Text>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <StopOutlined className="text-2xl text-purple-500 mb-2" />
            <Title level={5}>实时转换</Title>
            <Text type="secondary">快速准确的语音转文字</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpeechToText; 