import { useState, useCallback } from 'react';
import { message as antdMessage } from 'antd';
import { aiAPI, userAPI } from '../services/api';
import { handleError, ErrorLevel } from '../utils/ErrorHandler';
import { usePoints } from '../contexts/PointsContext';

interface UseAiFunctionOptions {
  onSuccess?: (result: string) => void;
  onError?: (error: any) => void;
  onPointsUpdate?: (newPoints: number) => void;
  showSuccessMessage?: boolean;
  autoUpdatePoints?: boolean;
}

interface AiFunctionMetrics {
  executionTime: number;
  inputLength: number;
  outputLength: number;
  timestamp: number;
}

export const useAiFunction = (options: UseAiFunctionOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [metrics, setMetrics] = useState<AiFunctionMetrics | null>(null);
  const { refreshPoints } = usePoints();
  
  const {
    showSuccessMessage = true,
    autoUpdatePoints = true,
    onSuccess,
    onError,
    onPointsUpdate
  } = options;

  const executeFunction = useCallback(async (
    functionName: string,
    input: string,
    customOptions?: Partial<UseAiFunctionOptions>
  ) => {
    const finalOptions = { ...options, ...customOptions };
    const startTime = Date.now();
    
    setLoading(true);
    setMetrics(null);
    
    try {
      // 调用AI功能
      const response = await aiAPI.processFunction(functionName, input);
      
      if (response.success) {
        const result = response.data;
        const executionTime = Date.now() - startTime;
        
        setResult(result);
        setMetrics({
          executionTime,
          inputLength: input.length,
          outputLength: result.length,
          timestamp: Date.now(),
        });
        
        // 自动更新积分
        if (autoUpdatePoints) {
          try {
            await refreshPoints();
          } catch (pointsError) {
            console.warn('更新积分失败:', pointsError);
          }
        }

        // 显示成功消息
        if (showSuccessMessage) {
          antdMessage.success({
            content: '处理完成！',
            duration: 3,
          });
        }
        
        finalOptions.onSuccess?.(result);
        return result;
      } else {
        throw new Error(response.message || 'AI功能执行失败');
      }
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      // 使用统一错误处理器
      const standardError = handleError(error, {
        showMessage: true,
        showNotification: false,
        logToConsole: true,
      });
      
      setMetrics({
        executionTime,
        inputLength: input.length,
        outputLength: 0,
        timestamp: Date.now(),
      });
      
      finalOptions.onError?.(standardError);
      throw standardError;
    } finally {
      setLoading(false);
    }
  }, [options, refreshPoints, autoUpdatePoints, showSuccessMessage]);

  const executeBatch = useCallback(async (
    requests: Array<{ functionName: string; input: string }>
  ) => {
    setLoading(true);
    const results = [];
    const errors = [];
    
    try {
      for (const request of requests) {
        try {
          const result = await executeFunction(request.functionName, request.input, {
            showSuccessMessage: false, // 批量时不显示单个成功消息
          });
          results.push({ ...request, result, success: true });
        } catch (error) {
          results.push({ ...request, error, success: false });
          errors.push(error);
        }
      }
      
      // 显示批量结果
      const successCount = results.filter(r => r.success).length;
      const failureCount = errors.length;
      
      if (failureCount === 0) {
        antdMessage.success(`批量处理完成！成功处理 ${successCount} 个请求`);
      } else {
        antdMessage.warning(`批量处理完成！成功 ${successCount} 个，失败 ${failureCount} 个`);
      }
      
      return results;
    } finally {
      setLoading(false);
    }
  }, [executeFunction]);

  const validateFunction = useCallback(async (functionName: string): Promise<boolean> => {
    try {
      const response = await aiAPI.getFunctions();
      if (response.success) {
        return Object.keys(response.data).includes(functionName);
      }
      return false;
    } catch (error) {
      console.warn('验证AI功能失败:', error);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setResult('');
    setLoading(false);
    setMetrics(null);
  }, []);

  return {
    loading,
    result,
    metrics,
    executeFunction,
    executeBatch,
    validateFunction,
    reset,
  };
};

export default useAiFunction;