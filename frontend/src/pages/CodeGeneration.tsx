import React, { useState } from 'react';
import { Input, Button, Card, Typography, message, Space, Select } from 'antd';
import { CodeOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const CodeGeneration: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const handleGenerate = async () => {
    if (!input.trim()) {
      message.warning('请输入代码需求描述');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.processFunction('code-generation', input);
      
      if (response.success) {
        setOutput(response.data);
        message.success('代码生成成功！');
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
    const extension = language === 'javascript' ? 'js' : 
                     language === 'python' ? 'py' : 
                     language === 'java' ? 'java' : 
                     language === 'cpp' ? 'cpp' : 'txt';
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('文件已下载');
  };

  const suggestions = [
    '创建一个React组件',
    '写一个排序算法',
    '实现用户登录功能',
    '创建一个API接口',
    '写一个数据库查询',
    '实现文件上传功能'
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          代码生成
        </Title>
        <Text type="secondary">
          描述您的需求，AI将为您生成相应的代码
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            需求描述
          </Title>
          
          <div className="mb-4">
            <Text type="secondary" className="mb-2 block">
              编程语言：
            </Text>
            <Select
              value={language}
              onChange={setLanguage}
              style={{ width: '100%' }}
              className="mb-4"
            >
              {languages.map(lang => (
                <Option key={lang.value} value={lang.value}>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </div>
          
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请详细描述您需要的代码功能..."
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
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
          
          <Button
            type="primary"
            icon={<CodeOutlined />}
            onClick={handleGenerate}
            loading={loading}
            disabled={!input.trim()}
            className="btn-primary w-full"
            size="large"
          >
            生成代码
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
            <div className="bg-gray-900 rounded-lg p-4 min-h-[400px] overflow-auto">
              <pre className="text-green-400 text-sm">
                <code>{output}</code>
              </pre>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <CodeOutlined className="text-4xl mb-2" />
                <Text type="secondary">
                  生成的代码将显示在这里
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
          <Text>• 选择您需要的编程语言</Text>
          <Text>• 详细描述您需要的代码功能</Text>
          <Text>• 点击"生成代码"按钮，AI将为您创建相应代码</Text>
          <Text>• 生成的代码可以复制或下载保存</Text>
          <Text>• 每次生成将消耗相应积分</Text>
        </div>
      </Card>

      {/* 支持的语言 */}
      <Card className="glass">
        <Title level={4} className="mb-4">
          支持的编程语言
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {languages.map(lang => (
            <div key={lang.value} className="text-center p-3 bg-gray-50 rounded-lg">
              <CodeOutlined className="text-2xl text-blue-500 mb-2" />
              <div className="font-medium">{lang.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CodeGeneration; 