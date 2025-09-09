/**
 * 应用常量配置
 */

// API相关常量
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
} as const;

// 路由常量
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  AI_FUNCTIONS: '/ai-functions',
  CHAT: '/chat',
  TEXT_GENERATION: '/text-generation',
  IMAGE_RECOGNITION: '/image-recognition',
  SPEECH_TO_TEXT: '/speech-to-text',
  CODE_GENERATION: '/code-generation',
  DOCUMENT_SUMMARY: '/document-summary',
} as const;

// AI功能常量
export const AI_FUNCTIONS = {
  CHAT: 'chat',
  TEXT_GENERATION: 'text-generation',
  IMAGE_RECOGNITION: 'image-recognition',
  SPEECH_TO_TEXT: 'speech-to-text',
  CODE_GENERATION: 'code-generation',
  DOCUMENT_SUMMARY: 'document-summary',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// 消息类型
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// 用户角色
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

// 交易类型
export const TRANSACTION_TYPES = {
  RECHARGE: 'RECHARGE',
  CONSUME: 'CONSUME',
  REFUND: 'REFUND',
  BONUS: 'BONUS',
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENT: ['.txt', '.doc', '.docx', '.pdf'],
  },
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
} as const;

// 主题配置
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

// 语言配置
export const LANGUAGE = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
} as const; 