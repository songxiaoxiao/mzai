import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

interface RequestOptions {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  retries?: number;
}

/**
 * 统一的API管理器
 * 提供标准化的HTTP请求处理、错误处理、重试机制等
 */
export class ApiManager {
  private instance: AxiosInstance;
  private config: ApiConfig;
  private requestInterceptorId: number | null = null;
  private responseInterceptorId: number | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.requestInterceptorId = this.instance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = this.getAuthToken();
        if (token && !config.headers['skip-auth']) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求ID用于跟踪
        config.headers['X-Request-ID'] = this.generateRequestId();

        console.debug('API Request:', {
          method: config.method,
          url: config.url,
          data: config.data,
        });

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.responseInterceptorId = this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.debug('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      async (error: AxiosError) => {
        console.error('API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });

        // 401错误处理 - 自动登出
        if (error.response?.status === 401) {
          this.handleAuthError();
          return Promise.reject(error);
        }

        // 重试机制
        const config = error.config as any;
        if (this.shouldRetry(error) && (!config._retryCount || config._retryCount < this.config.retryAttempts)) {
          config._retryCount = (config._retryCount || 0) + 1;
          console.warn(`Retrying request (attempt ${config._retryCount}):`, config.url);
          
          // 延迟重试
          await this.delay(1000 * config._retryCount);
          return this.instance(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET请求
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.instance.get(url, {
      headers: options.skipAuth ? { 'skip-auth': 'true' } : {},
    });
  }

  /**
   * POST请求
   */
  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, {
      headers: options.skipAuth ? { 'skip-auth': 'true' } : {},
    });
  }

  /**
   * PUT请求
   */
  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, {
      headers: options.skipAuth ? { 'skip-auth': 'true' } : {},
    });
  }

  /**
   * DELETE请求
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, {
      headers: options.skipAuth ? { 'skip-auth': 'true' } : {},
    });
  }

  /**
   * 文件上传
   */
  async upload<T>(url: string, formData: FormData, options: RequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(options.skipAuth ? { 'skip-auth': 'true' } : {}),
      },
    });
  }

  /**
   * 批量请求
   */
  async batch<T>(requests: Array<() => Promise<AxiosResponse<T>>>): Promise<AxiosResponse<T>[]> {
    try {
      return await Promise.all(requests.map(request => request()));
    } catch (error) {
      console.error('Batch request failed:', error);
      throw error;
    }
  }

  // 私有方法

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private handleAuthError() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 避免循环重定向
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  private shouldRetry(error: AxiosError): boolean {
    // 只对网络错误和5xx错误重试
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 设置基础URL
   */
  setBaseURL(baseURL: string) {
    this.instance.defaults.baseURL = baseURL;
  }

  /**
   * 清理拦截器
   */
  destroy() {
    if (this.requestInterceptorId !== null) {
      this.instance.interceptors.request.eject(this.requestInterceptorId);
    }
    if (this.responseInterceptorId !== null) {
      this.instance.interceptors.response.eject(this.responseInterceptorId);
    }
  }
}

// 创建默认实例
export const apiManager = new ApiManager({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  retryAttempts: config.api.retryAttempts,
});

export default apiManager;