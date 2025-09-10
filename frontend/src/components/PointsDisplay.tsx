import React, { useState, useEffect } from 'react';
import { Card, Tooltip, Progress, Button, Space, Typography, Badge } from 'antd';
import {
  WalletOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { usePoints } from '../contexts/PointsContext';

const { Text, Title } = Typography;

interface PointsDisplayProps {
  showDetails?: boolean;
  showProgress?: boolean;
  size?: 'small' | 'default' | 'large';
  variant?: 'card' | 'compact' | 'badge';
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  showDetails = false,
  showProgress = false,
  size = 'default',
  variant = 'card'
}) => {
  const { points, loading, refreshPoints } = usePoints();
  const [previousPoints, setPreviousPoints] = useState<number>(points);
  const [changeAnimation, setChangeAnimation] = useState<'up' | 'down' | null>(null);

  // 监听积分变化，触发动画效果
  useEffect(() => {
    if (points !== previousPoints && previousPoints !== 0) {
      setChangeAnimation(points > previousPoints ? 'up' : 'down');
      setPreviousPoints(points);
      
      // 清除动画效果
      const timer = setTimeout(() => {
        setChangeAnimation(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (previousPoints === 0) {
      setPreviousPoints(points);
    }
  }, [points, previousPoints]);

  // 根据积分数量确定状态颜色和提示
  const getPointsStatus = (points: number) => {
    if (points >= 100) {
      return { color: 'green', status: '充足', level: '高' };
    } else if (points >= 50) {
      return { color: 'blue', status: '正常', level: '中' };
    } else if (points >= 20) {
      return { color: 'orange', status: '偏低', level: '低' };
    } else {
      return { color: 'red', status: '不足', level: '很低' };
    }
  };

  const status = getPointsStatus(points);

  // 紧凑显示模式
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <WalletOutlined 
          style={{
            color: status.color === 'green' ? '#10b981' :
                   status.color === 'blue' ? '#3b82f6' :
                   status.color === 'orange' ? '#f59e0b' :
                   '#ef4444'
          }}
        />
        <Text 
          className={`font-semibold ${changeAnimation ? 'animate-pulse' : ''}`}
          style={{
            color: status.color === 'green' ? '#059669' :
                   status.color === 'blue' ? '#2563eb' :
                   status.color === 'orange' ? '#d97706' :
                   '#dc2626'
          }}
        >
          {points}
        </Text>
        <Text type="secondary" className="text-xs">积分</Text>
      </div>
    );
  }

  // 徽章显示模式
  if (variant === 'badge') {
    return (
      <Badge count={points} color={status.color}>
        <WalletOutlined className="text-xl text-gray-500" />
      </Badge>
    );
  }

  // 卡片显示模式（默认）
  return (
    <Card 
      className={`glass ${changeAnimation ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}
      size={size === 'large' ? 'default' : size}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: status.color === 'green' ? 'linear-gradient(to right, #10b981, #059669)' :
                         status.color === 'blue' ? 'linear-gradient(to right, #3b82f6, #2563eb)' :
                         status.color === 'orange' ? 'linear-gradient(to right, #f59e0b, #d97706)' :
                         'linear-gradient(to right, #ef4444, #dc2626)'
            }}
          >
            <WalletOutlined className="text-white text-lg" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <Title 
                level={size === 'large' ? 2 : size === 'small' ? 5 : 3} 
                className={`mb-0 ${
                  changeAnimation === 'up' ? 'animate-bounce' : 
                  changeAnimation === 'down' ? 'animate-pulse text-red-500' : ''
                }`}
                style={{
                  color: status.color === 'green' ? '#059669' :
                         status.color === 'blue' ? '#2563eb' :
                         status.color === 'orange' ? '#d97706' :
                         '#dc2626'
                }}
              >
                {points}
              </Title>
              
              {changeAnimation && (
                <div className="text-xs text-gray-500 flex items-center">
                  {changeAnimation === 'up' ? (
                    <ArrowUpOutlined className="text-green-500" />
                  ) : (
                    <ArrowDownOutlined className="text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            <Text type="secondary" className="text-sm">
              当前积分 - {status.status}
            </Text>
            
            {showProgress && (
              <div className="mt-2 w-32">
                <Progress 
                  percent={(points / 200) * 100} 
                  size="small" 
                  status={status.color === 'red' ? 'exception' : 'active'}
                  strokeColor={
                    status.color === 'green' ? '#059669' :
                    status.color === 'blue' ? '#2563eb' :
                    status.color === 'orange' ? '#d97706' :
                    '#dc2626'
                  }
                  showInfo={false}
                />
                <Text className="text-xs text-gray-500">
                  充足线: 200积分
                </Text>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <Tooltip title="刷新积分">
            <Button 
              type="text" 
              size="small" 
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={refreshPoints}
              className="text-gray-400 hover:text-blue-500"
            />
          </Tooltip>
          
          {showDetails && (
            <Tooltip title={`积分等级: ${status.level}`}>
              <div className="flex items-center space-x-1">
                <ThunderboltOutlined 
                  className="text-sm"
                  style={{
                    color: status.color === 'green' ? '#10b981' :
                           status.color === 'blue' ? '#3b82f6' :
                           status.color === 'orange' ? '#f59e0b' :
                           '#ef4444'
                  }}
                />
                <Text className="text-xs text-gray-500">{status.level}</Text>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Text className="text-xs text-gray-500 block">今日可用</Text>
              <Text className="font-semibold text-blue-600">
                {Math.max(0, points - 10)}
              </Text>
            </div>
            <div className="text-center">
              <Text className="text-xs text-gray-500 block">预估使用</Text>
              <Text className="font-semibold text-green-600">
                {Math.floor(points / 20)} 次
              </Text>
            </div>
          </div>
          
          {points < 50 && (
            <div className="mt-3 p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <InfoCircleOutlined className="text-orange-500 text-sm" />
                <Text className="text-xs text-orange-700">
                  积分偏低，建议及时充值
                </Text>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PointsDisplay;