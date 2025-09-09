import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  className?: string;
}

/**
 * 通用加载组件
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'default', 
  text = '加载中...', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Spin size={size} />
      {text && <p className="mt-2 text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 