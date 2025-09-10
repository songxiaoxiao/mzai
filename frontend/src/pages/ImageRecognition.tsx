import React, { useState } from 'react';
import { Upload, Button, Card, Typography, message, Space, Result } from 'antd';
import { CameraOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const ImageRecognition: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB！');
      return false;
    }

    // 读取图片并转换为base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageUrl(base64);
      handleRecognize(base64);
    };
    reader.readAsDataURL(file);

    return false; // 阻止默认上传行为
  };

  const handleRecognize = async (imageData: string) => {
    setLoading(true);
    try {
      const response = await aiAPI.processFunction('image-recognition', imageData);
      
      if (response.success) {
        setResult(response.data);
        message.success('图像识别完成！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '识别失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'image',
    multiple: false,
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          图像识别
        </Title>
        <Text type="secondary">
          上传图片，AI将识别图像中的内容并为您提供详细描述
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 上传区域 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            上传图片
          </Title>
          
          <Dragger {...uploadProps} className="mb-4">
            <div className="p-8 text-center">
              <CameraOutlined className="text-4xl text-gray-400 mb-4" />
              <p className="text-lg">点击或拖拽图片到此区域上传</p>
              <p className="text-sm text-gray-500">
                支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
              </p>
            </div>
          </Dragger>

          {imageUrl && (
            <div className="mt-4">
              <img 
                src={imageUrl} 
                alt="上传的图片" 
                className="w-full max-h-64 object-contain rounded-lg"
              />
            </div>
          )}
        </Card>

        {/* 识别结果 */}
        <Card className="glass">
          <Title level={4} className="mb-4">
            识别结果
          </Title>
          
          {result ? (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              <Paragraph className="whitespace-pre-wrap text-gray-800">
                {result}
              </Paragraph>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <EyeOutlined className="text-4xl mb-2" />
                <Text type="secondary">
                  识别结果将显示在这里
                </Text>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-4 text-center">
              <div className="loading-spinner mx-auto mb-2"></div>
              <Text type="secondary">正在识别中...</Text>
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
          <Text>• 支持上传 JPG、PNG、GIF 格式的图片</Text>
          <Text>• 图片大小不能超过 5MB</Text>
          <Text>• AI将识别图像中的物体、场景、文字等内容</Text>
          <Text>• 每次识别将消耗相应积分</Text>
        </div>
      </Card>

      {/* 示例图片 */}
      <Card className="glass">
        <Title level={4} className="mb-4">
          示例图片
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                <CameraOutlined className="text-2xl text-gray-400" />
              </div>
              <Text type="secondary" className="text-xs">
                示例图片 {i}
              </Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ImageRecognition; 