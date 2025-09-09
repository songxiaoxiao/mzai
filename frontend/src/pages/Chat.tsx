import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, Avatar, Space, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';
import { ChatMessage } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.processFunction('chat', input);
      
      if (response.data.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.data.data,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          智能对话
        </Title>
        <Text type="secondary">
          与AI助手进行智能对话，获取专业建议和帮助
        </Text>
      </div>

      <Card className="flex-1 flex flex-col glass">
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <RobotOutlined className="text-4xl text-gray-400 mb-4" />
              <Text type="secondary">
                开始与AI助手对话吧！
              </Text>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-3/4 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar
                  icon={message.isUser ? <UserOutlined /> : <RobotOutlined />}
                  className={message.isUser ? 'bg-blue-500' : 'bg-purple-500'}
                />
                <div className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                  message.isUser 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <Text className={message.isUser ? 'text-white' : 'text-gray-800'}>
                    {message.content}
                  </Text>
                  <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <Avatar icon={<RobotOutlined />} className="bg-purple-500" />
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex space-x-2">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
              disabled={!input.trim()}
              className="btn-primary"
            >
              发送
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat; 