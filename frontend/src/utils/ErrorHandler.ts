import { message, notification } from 'antd';
import { AxiosError } from 'axios';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  BUSINESS = 'BUSINESS',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 错误级别枚举
 */
export enum ErrorLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * 标准化错误接口
 */
export interface StandardError {
  type: ErrorType;
  level: ErrorLevel;
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  requestId?: string;
}

/**
 * 错误处理配置
 */
interface ErrorHandlerConfig {
  showNotification: boolean;
  showMessage: boolean;
  logToConsole: boolean;
  reportToServer: boolean;
}

/**
 * 统一错误处理器
 */
export class ErrorHandler {
  private defaultConfig: ErrorHandlerConfig = {
    showNotification: false,
    showMessage: true,
    logToConsole: true,
    reportToServer: false,
  };

  /**
   * 处理错误
   */
  handle(error: any, config?: Partial<ErrorHandlerConfig>): StandardError {
    const finalConfig = { ...this.defaultConfig, ...config };
    const standardError = this.standardizeError(error);

    // 控制台日志
    if (finalConfig.logToConsole) {
      this.logError(standardError);
    }

    // 显示错误消息
    if (finalConfig.showMessage) {
      this.showErrorMessage(standardError);
    }

    // 显示通知
    if (finalConfig.showNotification) {
      this.showErrorNotification(standardError);
    }

    // 上报到服务器
    if (finalConfig.reportToServer) {
      this.reportError(standardError);
    }

    return standardError;
  }

  /**
   * 标准化错误
   */
  private standardizeError(error: any): StandardError {
    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }

    if (error instanceof Error) {
      return this.handleJavaScriptError(error);
    }

    if (typeof error === 'string') {
      return this.createStandardError(ErrorType.UNKNOWN, ErrorLevel.MEDIUM, 'UNKNOWN_ERROR', error);
    }

    return this.createStandardError(ErrorType.UNKNOWN, ErrorLevel.MEDIUM, 'UNKNOWN_ERROR', '未知错误');
  }

  /**
   * 处理Axios错误
   */
  private handleAxiosError(error: AxiosError): StandardError {
    const response = error.response;
    const request = error.request;

    if (response) {
      const status = response.status;
      const data = response.data as any;

      // 根据状态码分类错误
      if (status === 400) {
        return this.createStandardError(
          ErrorType.VALIDATION,
          ErrorLevel.MEDIUM,
          'VALIDATION_ERROR',
          data?.message || '请求参数错误',
          data
        );
      }

      if (status === 401) {
        return this.createStandardError(
          ErrorType.AUTHENTICATION,
          ErrorLevel.HIGH,
          'AUTHENTICATION_ERROR',
          '认证失败，请重新登录'
        );
      }

      if (status === 403) {
        return this.createStandardError(
          ErrorType.AUTHORIZATION,
          ErrorLevel.HIGH,
          'AUTHORIZATION_ERROR',
          '权限不足，无法执行此操作'
        );
      }

      if (status >= 500) {
        return this.createStandardError(
          ErrorType.SERVER,
          ErrorLevel.CRITICAL,
          'SERVER_ERROR',
          '服务器错误，请稍后重试'
        );
      }

      // 业务错误
      return this.createStandardError(
        ErrorType.BUSINESS,
        ErrorLevel.MEDIUM,
        data?.code || 'BUSINESS_ERROR',
        data?.message || error.message,
        data
      );
    }

    if (request) {
      return this.createStandardError(
        ErrorType.NETWORK,
        ErrorLevel.HIGH,
        'NETWORK_ERROR',
        '网络连接失败，请检查网络设置'
      );
    }

    return this.createStandardError(
      ErrorType.UNKNOWN,
      ErrorLevel.MEDIUM,
      'UNKNOWN_ERROR',
      error.message || '未知网络错误'
    );
  }

  /**
   * 处理JavaScript错误
   */
  private handleJavaScriptError(error: Error): StandardError {
    return this.createStandardError(
      ErrorType.UNKNOWN,
      ErrorLevel.MEDIUM,
      'JAVASCRIPT_ERROR',
      error.message,
      { stack: error.stack }
    );
  }

  /**
   * 创建标准错误对象
   */
  private createStandardError(
    type: ErrorType,
    level: ErrorLevel,
    code: string,
    message: string,
    details?: any
  ): StandardError {
    return {
      type,
      level,
      code,
      message,
      details,
      timestamp: Date.now(),
      requestId: this.generateRequestId(),
    };
  }

  /**
   * 显示错误消息
   */
  private showErrorMessage(error: StandardError) {
    const { level, message:errorMessage } = error;

    switch (level) {
      case ErrorLevel.CRITICAL:
      case ErrorLevel.HIGH:
        message.error({
          content: errorMessage,
          duration: 6,
        });
        break;
      case ErrorLevel.MEDIUM:
        message.warning({
          content: errorMessage,
          duration: 4,
        });
        break;
      case ErrorLevel.LOW:
        message.info({
          content: errorMessage,
          duration: 3,
        });
        break;
    }
  }

  /**
   * 显示错误通知
   */
  private showErrorNotification(error: StandardError) {
    const { level, message: msg, code } = error;
    
    const config = {
      message: '系统错误',
      description: msg,
      duration: 4.5,
    };

    switch (level) {
      case ErrorLevel.CRITICAL:
        notification.error({
          ...config,
          message: '严重错误',
          duration: 0, // 不自动关闭
        });
        break;
      case ErrorLevel.HIGH:
        notification.error(config);
        break;
      case ErrorLevel.MEDIUM:
        notification.warning(config);
        break;
      case ErrorLevel.LOW:
        notification.info(config);
        break;
    }
  }

  /**
   * 记录错误日志
   */
  private logError(error: StandardError) {
    const logMessage = `[${error.level}] ${error.type}:${error.code} - ${error.message}`;
    
    switch (error.level) {
      case ErrorLevel.CRITICAL:
      case ErrorLevel.HIGH:
        console.error(logMessage, error);
        break;
      case ErrorLevel.MEDIUM:
        console.warn(logMessage, error);
        break;
      case ErrorLevel.LOW:
        console.info(logMessage, error);
        break;
    }
  }

  /**
   * 上报错误到服务器
   */
  private async reportError(error: StandardError) {
    try {
      // 这里可以调用错误上报API
      // await apiManager.post('/errors/report', error);
      console.info('Error reported to server:', error);
    } catch (e) {
      console.warn('Failed to report error to server:', e);
    }
  }

  // 工具方法

  private isAxiosError(error: any): error is AxiosError {
    return error && error.isAxiosError === true;
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// 创建全局错误处理器实例
export const errorHandler = new ErrorHandler();

// 便利方法
export const handleError = (error: any, config?: Partial<ErrorHandlerConfig>) => {
  return errorHandler.handle(error, config);
};

export default errorHandler;