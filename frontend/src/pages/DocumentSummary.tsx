import React, { useState } from 'react';
import { Input, Button, Card, Typography, message, Space, Upload } from 'antd';
import { BookOutlined, FileTextOutlined, UploadOutlined, CopyOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const DocumentSummary: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) {
      message.warning('请输入要总结的文档内容');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.processFunction('document-summary', input);
      
      if (response.data.success) {
        setOutput(response.data.data);
        message.success('文档总结完成！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '总结失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    message.success('已复制到剪贴板');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      message.success('文件上传成功！');
    };
    reader.readAsText(file);
    return false;
  };

  const suggestions = [
    '总结这篇技术文档',
    '提取文章的关键要点',
    '生成会议纪要',
    '总结研究报告',
    '提取新闻要点',
    '总结学术论文'
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: handleFileUpload,
    showUploadList: false,
    accept: '.txt,.doc,.docx,.pdf'
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          文档总结
        </Title>
        <Text type="secondary">
          上传文档或输入内容，AI将为您生成智能总结
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            文档内容
          </Title>
          
          <Dragger {...uploadProps} className="mb-4">
            <div className="p-4 text-center">
              <UploadOutlined className="text-2xl text-gray-400 mb-2" />
              <p>点击或拖拽文件到此区域上传</p>
              <p className="text-sm text-gray-500">
                支持 TXT、DOC、DOCX、PDF 格式
              </p>
            </div>
          </Dragger>
          
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入要总结的文档内容..."
            autoSize={{ minRows: 8, maxRows: 12 }}
            className="mb-4"
          />
          
          <div className="mb-4">
            <Text type="secondary" className="mb-2 block">
              快速建议：
            </Text>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm cursor-pointer hover:bg-green-200"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
          
          <Button
            type="primary"
            icon={<BookOutlined />}
            onClick={handleSummarize}
            loading={loading}
            disabled={!input.trim()}
            className="btn-primary w-full"
            size="large"
          >
            生成总结
          </Button>
        </Card>

        {/* 输出区域 */}
        <Card className="glass">
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>
              总结结果
            </Title>
            {output && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopy}
                size="small"
              >
                复制
              </Button>
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
                  总结结果将显示在这里
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
          <Text>• 可以直接输入文档内容或上传文件</Text>
          <Text>• 支持多种文档格式：TXT、DOC、DOCX、PDF</Text>
          <Text>• AI将自动提取关键信息并生成总结</Text>
          <Text>• 总结结果可以复制保存</Text>
          <Text>• 每次总结将消耗相应积分</Text>
        </div>
      </Card>

      {/* 功能特点 */}
      <Card className="glass">
        <Title level={4} className="mb-4">
          功能特点
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BookOutlined className="text-2xl text-blue-500 mb-2" />
            <Title level={5}>智能提取</Title>
            <Text type="secondary">自动识别文档关键信息</Text>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FileTextOutlined className="text-2xl text-green-500 mb-2" />
            <Title level={5}>多格式支持</Title>
            <Text type="secondary">支持多种文档格式</Text>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <UploadOutlined className="text-2xl text-purple-500 mb-2" />
            <Title level={5}>快速总结</Title>
            <Text type="secondary">高效准确的文档总结</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentSummary; 