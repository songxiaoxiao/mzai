import React, { useState } from 'react';
import { Input, Button, Card, Typography, message, Space, Tag } from 'antd';
import { FileTextOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const TextGeneration: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      message.warning('请输入要生成的文本内容');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.processFunction('text-generation', input);
      
      if (response.success) {
        setOutput(response.data);
        message.success('文本生成成功！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    message.success('已复制到剪贴板');
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('文件已下载');
  };

  const suggestions = [
    '写一篇关于人工智能的文章',
    '创作一首现代诗歌',
    '写一个产品介绍文案',
    '生成一个故事开头',
    '写一段营销文案',
    '创作一个广告标语'
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          文本生成
        </Title>
        <Text type="secondary">
          基于您的输入，AI将生成创意文本内容
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            输入内容
          </Title>
          
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您想要生成的文本内容..."
            autoSize={{ minRows: 8, maxRows: 12 }}
            className="mb-4"
          />
          
          <div className="mb-4">
            <Text type="secondary" className="mb-2 block">
              快速建议：
            </Text>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Tag
                  key={index}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Tag>
              ))}
            </div>
          </div>
          
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={handleGenerate}
            loading={loading}
            disabled={!input.trim()}
            className="btn-primary w-full"
            size="large"
          >
            生成文本
          </Button>
        </Card>

        {/* 输出区域 */}
        <Card className="glass">
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>
              生成结果
            </Title>
            {output && (
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  size="small"
                >
                  复制
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  size="small"
                >
                  下载
                </Button>
              </Space>
            )}
          </div>
          
          {output ? (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <Paragraph className="whitespace-pre-wrap text-gray-800">
                {output}
              </Paragraph>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FileTextOutlined className="text-4xl mb-2" />
                <Text type="secondary">
                  生成的文本将显示在这里
                </Text>
              </div>
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
          <Text>• 在左侧输入框中描述您想要生成的文本类型和内容</Text>
          <Text>• 点击"生成文本"按钮，AI将为您创建相关内容</Text>
          <Text>• 生成的文本可以复制或下载保存</Text>
          <Text>• 每次生成将消耗相应积分</Text>
        </div>
      </Card>
    </div>
  );
};

export default TextGeneration; 