import { useState, useCallback } from 'react';
import { message } from 'antd';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showMessage?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * 通用API调用Hook
 * 提供统一的API调用、加载状态和错误处理
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      
      if (response.data?.success) {
        setData(response.data.data);
        options.onSuccess?.(response.data.data);
        
        if (options.showMessage !== false) {
          message.success(response.data.message || '操作成功');
        }
      } else {
        throw new Error(response.data?.error || '操作失败');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || '操作失败';
      setError(err);
      options.onError?.(err);
      
      if (options.showMessage !== false) {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * 带参数的API调用Hook
 */
export function useApiWithParams<T = any>(
  apiFunction: (params: any) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  return useApi(apiFunction, options);
} 