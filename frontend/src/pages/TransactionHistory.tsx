import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Tag, 
  Space, 
  Tooltip, 
  Button, 
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Empty
} from 'antd';
import {
  WalletOutlined,
  HistoryOutlined,
  TrophyOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Transaction } from '../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟API调用 - 在实际应用中应该从后端获取
const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'CONSUME',
    amount: -10,
    balanceAfter: 90,
    description: '使用智能对话功能',
    aiFunction: 'chat',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'CONSUME',
    amount: -40,
    balanceAfter: 50,
    description: '使用代码生成功能',
    aiFunction: 'code-generation',
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: 3,
    type: 'RECHARGE',
    amount: 100,
    balanceAfter: 150,
    description: '积分充值',
    createdAt: '2024-01-14T09:15:00Z'
  },
  {
    id: 4,
    type: 'BONUS',
    amount: 50,
    balanceAfter: 200,
    description: '新用户奖励',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 5,
    type: 'CONSUME',
    amount: -35,
    balanceAfter: 165,
    description: '使用文档总结功能',
    aiFunction: 'document-summary',
    createdAt: '2024-01-13T16:45:00Z'
  }
];

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, typeFilter, dateRange]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('获取交易历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // 按类型过滤
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // 按日期过滤
    if (dateRange) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.createdAt);
        const startDate = new Date(dateRange[0].format('YYYY-MM-DD'));
        const endDate = new Date(dateRange[1].format('YYYY-MM-DD'));
        endDate.setHours(23, 59, 59, 999); // 包含结束日期的全天
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    setFilteredTransactions(filtered);
  };

  const getTypeTag = (type: Transaction['type']) => {
    const typeConfig = {
      CONSUME: { color: 'red', icon: <MinusCircleOutlined />, text: '消费' },
      RECHARGE: { color: 'green', icon: <PlusCircleOutlined />, text: '充值' },
      REFUND: { color: 'blue', icon: <PlusCircleOutlined />, text: '退款' },
      BONUS: { color: 'gold', icon: <TrophyOutlined />, text: '奖励' }
    };

    const config = typeConfig[type];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getAmountDisplay = (amount: number, type: Transaction['type']) => {
    const isPositive = amount > 0;
    return (
      <span className={isPositive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
        {isPositive ? '+' : ''}{amount}
      </span>
    );
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const dateObj = new Date(date);
        return (
          <div>
            <div>{dateObj.toISOString().split('T')[0]}</div>
            <div className="text-gray-500 text-sm">{dateObj.toTimeString().split(' ')[0]}</div>
          </div>
        );
      },
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: Transaction['type']) => getTypeTag(type),
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string, record: Transaction) => (
        <div>
          <div>{description}</div>
          {record.aiFunction && (
            <Tag className="mt-1 text-xs">{record.aiFunction}</Tag>
            )}
        </div>
      ),
    },
    {
      title: '金额变化',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Transaction) => getAmountDisplay(amount, record.type),
      width: 120,
      align: 'right' as const,
    },
    {
      title: '余额',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (balance: number) => (
        <span className="font-semibold text-blue-600">{balance}</span>
      ),
      width: 100,
      align: 'right' as const,
    }
  ];

  // 计算统计数据
  const totalConsume = transactions
    .filter(t => t.type === 'CONSUME')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const totalRecharge = transactions
    .filter(t => t.type === 'RECHARGE' || t.type === 'BONUS')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = transactions.length > 0 
    ? Math.max(...transactions.map(t => t.balanceAfter))
    : 0;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <Card className="glass">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="gradient-text mb-2">
              <HistoryOutlined className="mr-2" />
              积分使用历史
            </Title>
            <Text type="secondary" className="text-lg">
              查看您的积分使用记录和账户变动
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchTransactions}
            loading={loading}
          >
            刷新
          </Button>
        </div>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="glass">
            <Statistic
              title="当前余额"
              value={currentBalance}
              prefix={<WalletOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
              suffix="积分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass">
            <Statistic
              title="总充值"
              value={totalRecharge}
              prefix={<PlusCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
              suffix="积分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="glass">
            <Statistic
              title="总消费"
              value={totalConsume}
              prefix={<MinusCircleOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
              suffix="积分"
            />
          </Card>
        </Col>
      </Row>

      {/* 过滤器 */}
      <Card className="glass">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong>交易类型：</Text>
              <Select 
                value={typeFilter} 
                onChange={setTypeFilter}
                className="w-full mt-1"
              >
                <Option value="all">全部</Option>
                <Option value="CONSUME">消费</Option>
                <Option value="RECHARGE">充值</Option>
                <Option value="BONUS">奖励</Option>
                <Option value="REFUND">退款</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <div>
              <Text strong>时间范围：</Text>
              <RangePicker 
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                className="w-full mt-1"
                format="YYYY-MM-DD"
              />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="flex items-end h-full space-x-2">
              <Button onClick={() => {
                setTypeFilter('all');
                setDateRange(null);
              }}>
                重置筛选
              </Button>
              <Button type="dashed" icon={<DownloadOutlined />}>
                导出记录
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 交易记录表格 */}
      <Card className="glass">
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredTransactions.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无交易记录"
              />
            )
          }}
        />
      </Card>
    </div>
  );
};

export default TransactionHistory;