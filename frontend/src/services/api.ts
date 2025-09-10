import { ApiResponse } from '../types';
import { apiManager } from './ApiManager';
import { handleError } from '../utils/ErrorHandler';

/**
 * 基础API服务类
 * 提供通用的API操作方法
 */
class BaseApiService {
  protected async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiManager[method]<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      const standardError = handleError(error);
      throw standardError;
    }
  }

  protected async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await apiManager.upload<ApiResponse<T>>(url, formData);
      return response.data;
    } catch (error) {
      const standardError = handleError(error);
      throw standardError;
    }
  }
}

/**
 * 认证服务
 */
class AuthService extends BaseApiService {
  async register(userData: any): Promise<ApiResponse<any>> {
    return this.request('post', '/auth/register', userData);
  }

  async login(credentials: any): Promise<ApiResponse<any>> {
    return this.request('post', '/auth/login', credentials);
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('get', '/auth/me');
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * 用户服务
 */
class UserService extends BaseApiService {
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('get', '/user/profile');
  }

  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    return this.request('put', '/user/profile', userData);
  }

  async getPoints(): Promise<ApiResponse<number>> {
    return this.request('get', '/user/points');
  }
}

/**
 * AI功能服务
 */
class AiService extends BaseApiService {
  async getFunctions(): Promise<ApiResponse<any>> {
    return this.request('get', '/ai/functions');
  }

  async getFunctionPoints(): Promise<ApiResponse<Record<string, number>>> {
    return this.request('get', '/ai/functions/points');
  }

  async processFunction(functionName: string, input: string): Promise<ApiResponse<string>> {
    return this.request('post', `/ai/${functionName}`, { input });
  }

  // 兼容旧接口的方法
  async chat(message: string): Promise<ApiResponse<string>> {
    return this.request('post', '/ai/chat', { message });
  }

  async generateCode(requirements: string): Promise<ApiResponse<string>> {
    return this.request('post', '/ai/code-generation', { requirements });
  }

  async generateText(prompt: string): Promise<ApiResponse<string>> {
    return this.request('post', '/ai/text-generation', { prompt });
  }

  async summarizeDocument(document: string): Promise<ApiResponse<string>> {
    return this.request('post', '/ai/document-summary', { document });
  }

  async movieClip(formData: FormData): Promise<ApiResponse<string>> {
    return this.upload('/ai/movie-clip', formData);
  }

  // AI提供商管理
  async getCurrentProvider(): Promise<ApiResponse<string>> {
    return this.request('get', '/ai/provider');
  }

  async switchProvider(provider: string): Promise<ApiResponse<string>> {
    return this.request('post', '/ai/provider/switch', { provider });
  }
}

/**
 * 积分服务
 */
class PointsService extends BaseApiService {
  async getUserBalance(userId: number): Promise<ApiResponse<number>> {
    return this.request('get', `/points/balance/${userId}`);
  }

  async getTransactionHistory(userId: number): Promise<ApiResponse<any[]>> {
    return this.request('get', `/points/transactions/${userId}`);
  }

  async recharge(amount: number, paymentMethod: string): Promise<ApiResponse<any>> {
    return this.request('post', '/points/recharge', { amount, paymentMethod });
  }
}

// 创建服务实例
export const authAPI = new AuthService();
export const userAPI = new UserService();
export const aiAPI = new AiService();
export const pointsAPI = new PointsService();

// 向后兼容的默认导出
export default apiManager; 