import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Upload, 
  message, 
  Typography, 
  Space, 
  Divider,
  Select,
  Slider,
  Row,
  Col,
  Progress,
  Alert
} from 'antd';
import { 
  UploadOutlined, 
  ScissorOutlined, 
  PlayCircleOutlined,
  DownloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MovieClipForm {
  videoFile: any;
  description: string;
  clipType: string;
  duration: number;
  style: string;
  targetLength: number;
}

const MovieClip: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const handleSubmit = async (values: MovieClipForm) => {
    if (!uploadedFile) {
      message.error('请先上传视频文件');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('videoFile', uploadedFile);
      formData.append('description', values.description);
      formData.append('clipType', values.clipType);
      formData.append('duration', values.duration.toString());
      formData.append('style', values.style);
      formData.append('targetLength', values.targetLength.toString());

      const response = await aiAPI.movieClip(formData);
      
      if (response.data.success) {
        setResult(response.data.data);
        message.success('电影快剪处理成功！');
      } else {
        message.error(response.data.message || '处理失败');
      }
    } catch (error: any) {
      console.error('电影快剪处理失败:', error);
      message.error(error.response?.data?.message || '处理失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (info: any) => {
    if (info.file.status === 'done') {
      setUploadedFile(info.file.originFileObj);
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  const uploadProps = {
    name: 'file',
    beforeUpload: (file: File) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('只能上传视频文件！');
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('视频文件大小不能超过100MB！');
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: handleFileUpload,
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Title level={2} className="gradient-text mb-2">
          <ScissorOutlined className="mr-2" />
          电影快剪
        </Title>
        <Text type="secondary" className="text-lg">
          使用AI智能剪辑您的视频，快速生成精彩片段
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="glass" title="视频上传与设置">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                clipType: 'highlight',
                duration: 30,
                style: 'cinematic',
                targetLength: 60
              }}
            >
              <Form.Item
                label="上传视频"
                name="videoFile"
                rules={[{ required: true, message: '请上传视频文件' }]}
              >
                <Upload {...uploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />} block>
                    选择视频文件
                  </Button>
                </Upload>
                <Text type="secondary" className="text-sm">
                  支持格式：MP4, AVI, MOV, MKV，最大100MB
                </Text>
              </Form.Item>

              <Form.Item
                label="剪辑描述"
                name="description"
                rules={[{ required: true, message: '请输入剪辑描述' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请描述您想要的剪辑效果，例如：提取最精彩的打斗场面，突出主角的表演，制作预告片风格等"
                />
              </Form.Item>

              <Form.Item
                label="剪辑类型"
                name="clipType"
                rules={[{ required: true, message: '请选择剪辑类型' }]}
              >
                <Select>
                  <Option value="highlight">精彩片段</Option>
                  <Option value="trailer">预告片</Option>
                  <Option value="summary">剧情总结</Option>
                  <Option value="action">动作场面</Option>
                  <Option value="emotional">情感片段</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="目标时长（秒）"
                    name="targetLength"
                  >
                    <Slider
                      min={10}
                      max={300}
                      marks={{
                        10: '10s',
                        60: '1min',
                        180: '3min',
                        300: '5min'
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="剪辑风格"
                    name="style"
                  >
                    <Select>
                      <Option value="cinematic">电影风格</Option>
                      <Option value="dynamic">动感风格</Option>
                      <Option value="elegant">优雅风格</Option>
                      <Option value="intense">紧张刺激</Option>
                      <Option value="romantic">浪漫风格</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<ScissorOutlined />}
                  block
                  size="large"
                  className="btn-primary"
                >
                  {loading ? '正在处理...' : '开始剪辑'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="glass" title="处理结果">
            {loading && (
              <div className="text-center py-8">
                <Progress type="circle" percent={75} />
                <Text className="block mt-4">AI正在分析视频内容...</Text>
                <Text type="secondary" className="text-sm">
                  这可能需要几分钟时间，请耐心等待
                </Text>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                <Alert
                  message="剪辑完成"
                  description="AI已成功生成剪辑结果"
                  type="success"
                  showIcon
                />
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Title level={5} className="mb-3">
                    <PlayCircleOutlined className="mr-2" />
                    剪辑结果
                  </Title>
                  <div className="space-y-3">
                    <div>
                      <Text strong>剪辑描述：</Text>
                      <Text>{form.getFieldValue('description')}</Text>
                    </div>
                    <div>
                      <Text strong>剪辑类型：</Text>
                      <Text>{form.getFieldValue('clipType')}</Text>
                    </div>
                    <div>
                      <Text strong>目标时长：</Text>
                      <Text>{form.getFieldValue('targetLength')}秒</Text>
                    </div>
                    <div>
                      <Text strong>剪辑风格：</Text>
                      <Text>{form.getFieldValue('style')}</Text>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <Title level={5} className="mb-3">
                    <InfoCircleOutlined className="mr-2" />
                    AI分析结果
                  </Title>
                  <Paragraph className="whitespace-pre-wrap">
                    {result}
                  </Paragraph>
                </div>

                <Space>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    onClick={() => message.info('下载功能开发中...')}
                  >
                    下载剪辑视频
                  </Button>
                  <Button 
                    onClick={() => {
                      setResult('');
                      form.resetFields();
                      setUploadedFile(null);
                    }}
                  >
                    重新剪辑
                  </Button>
                </Space>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center py-12 text-gray-400">
                <ScissorOutlined className="text-4xl mb-4" />
                <Text className="block">上传视频并设置参数后开始剪辑</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 功能说明 */}
      <Card className="glass">
        <Title level={3} className="mb-4">
          <InfoCircleOutlined className="mr-2" />
          功能说明
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ScissorOutlined className="text-white text-xl" />
              </div>
              <Title level={5}>智能分析</Title>
              <Text type="secondary">AI自动分析视频内容，识别精彩片段</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <PlayCircleOutlined className="text-white text-xl" />
              </div>
              <Title level={5}>自动剪辑</Title>
              <Text type="secondary">根据您的需求自动生成剪辑方案</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DownloadOutlined className="text-white text-xl" />
              </div>
              <Title level={5}>快速导出</Title>
              <Text type="secondary">支持多种格式导出，快速获得成品</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MovieClip; 