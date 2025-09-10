import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from '../services/api';
import { message } from 'antd';

interface PointsContextType {
  points: number;
  loading: boolean;
  refreshPoints: () => Promise<void>;
  updatePoints: (newPoints: number) => void;
  deductPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

interface PointsProviderProps {
  children: ReactNode;
}

export const PointsProvider: React.FC<PointsProviderProps> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取最新积分
  const refreshPoints = async () => {
    try {
      const response = await userAPI.getPoints();
      if (response.success) {
        setPoints(response.data);
      }
    } catch (error) {
      console.error('获取积分失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 直接更新积分（从API返回的最新数据）
  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
  };

  // 扣除积分（乐观更新，立即更新UI）
  const deductPoints = (amount: number) => {
    setPoints(prev => Math.max(0, prev - amount));
  };

  // 组件挂载时获取积分
  useEffect(() => {
    refreshPoints();
  }, []);

  // 每30秒自动刷新一次积分（可选）
  useEffect(() => {
    const interval = setInterval(() => {
      refreshPoints();
    }, 30000); // 30秒

    return () => clearInterval(interval);
  }, []);

  const value: PointsContextType = {
    points,
    loading,
    refreshPoints,
    updatePoints,
    deductPoints,
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};

// 自定义hook，用于在组件中使用积分上下文
export const usePoints = (): PointsContextType => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export default PointsContext;