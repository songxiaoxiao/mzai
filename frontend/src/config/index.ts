/**
 * 应用配置管理
 * 集中管理所有配置项
 */

// 环境变量类型定义
interface EnvironmentConfig {
  NODE_ENV: string;
  REACT_APP_API_BASE_URL?: string;
  REACT_APP_API_TIMEOUT?: string;
  REACT_APP_ENABLE_ANALYTICS?: string;
  REACT_APP_ENABLE_DEBUG?: string;
}

// 应用配置类型
interface AppConfig {
  api: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
  };
  app: {
    name: string;
    version: string;
    enableAnalytics: boolean;
    enableDebug: boolean;
  };
  ui: {
    theme: string;
    language: string;
    pageSize: number;
  };
  features: {
    enableNotifications: boolean;
    enableOffline: boolean;
    maxFileSize: number;
  };
  points: {
    lowBalanceThreshold: number;
    refreshInterval: number;
  };
}

// 获取环境变量
const env: EnvironmentConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  REACT_APP_API_TIMEOUT: process.env.REACT_APP_API_TIMEOUT,
  REACT_APP_ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS,
  REACT_APP_ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG,
};

// 应用配置
export const config: AppConfig = {
  api: {
    baseURL: env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    timeout: parseInt(env.REACT_APP_API_TIMEOUT || '30000', 10),
    retryAttempts: 3,
  },
  app: {
    name: 'AI智能平台',
    version: '1.0.0',
    enableAnalytics: env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebug: env.REACT_APP_ENABLE_DEBUG === 'true' || env.NODE_ENV === 'development',
  },
  ui: {
    theme: 'default',
    language: 'zh-CN',
    pageSize: 10,
  },
  features: {
    enableNotifications: true,
    enableOffline: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  points: {
    lowBalanceThreshold: 50,
    refreshInterval: 30000, // 30秒
  },
};

// AI功能配置
export const aiFunctionConfig = {
  functions: [
    {
      key: 'chat',
      name: '智能对话',
      description: '与AI助手进行智能对话，获取专业建议和帮助',
      category: 'communication',
      icon: 'MessageOutlined',
      color: 'from-blue-500 to-blue-600',
      features: ['自然语言交互', '多轮对话', '智能回答'],
    },
    {
      key: 'text-generation',
      name: '文本生成',
      description: '基于您的输入，AI将生成创意文本内容',
      category: 'generation',
      icon: 'FileTextOutlined',
      color: 'from-green-500 to-green-600',
      features: ['创意写作', '文案生成', '内容创作'],
    },
    {
      key: 'code-generation',
      name: '代码生成',
      description: '描述您的需求，AI将为您生成相应的代码',
      category: 'generation',
      icon: 'CodeOutlined',
      color: 'from-red-500 to-red-600',
      features: ['多语言支持', '智能生成', '代码优化'],
    },
    {
      key: 'document-summary',
      name: '文档总结',
      description: '智能总结文档内容，提取关键信息',
      category: 'analysis',
      icon: 'BookOutlined',
      color: 'from-indigo-500 to-indigo-600',
      features: ['智能摘要', '关键提取', '结构分析'],
    },
    {
      key: 'image-recognition',
      name: '图像识别',
      description: '上传图片，AI将识别图像中的内容并为您提供详细描述',
      category: 'analysis',
      icon: 'CameraOutlined',
      color: 'from-purple-500 to-purple-600',
      features: ['物体识别', '场景分析', '文字识别'],
    },
    {
      key: 'speech-to-text',
      name: '语音转文字',
      description: '将语音内容转换为文字，支持多种语言识别',
      category: 'conversion',
      icon: 'AudioOutlined',
      color: 'from-orange-500 to-orange-600',
      features: ['高精度识别', '多语言支持', '实时转换'],
    },
    {
      key: 'movie-clip',
      name: '电影快剪',
      description: '使用AI智能剪辑您的视频，快速生成精彩片段',
      category: 'media',
      icon: 'ScissorOutlined',
      color: 'from-pink-500 to-pink-600',
      features: ['智能分析', '自动剪辑', '快速导出'],
    },
  ],
};

// 路由配置
export const routes = {
  public: ['/login', '/register'],
  protected: [
    { path: '/dashboard', name: '仪表盘' },
    { path: '/ai-functions', name: 'AI功能' },
    { path: '/profile', name: '个人中心' },
    { path: '/transaction-history', name: '积分历史' },
    { path: '/chat', name: '智能对话' },
    { path: '/text-generation', name: '文本生成' },
    { path: '/code-generation', name: '代码生成' },
    { path: '/document-summary', name: '文档总结' },
    { path: '/image-recognition', name: '图像识别' },
    { path: '/speech-to-text', name: '语音转文字' },
    { path: '/movie-clip', name: '电影快剪' },
  ],
};

// 工具函数
export const utils = {
  isDevelopment: () => env.NODE_ENV === 'development',
  isProduction: () => env.NODE_ENV === 'production',
  getApiUrl: (path: string) => `${config.api.baseURL}${path}`,
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

export default config;