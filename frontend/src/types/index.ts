export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  points: number;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface AiFunction {
  name: string;
  description: string;
  points: number;
}

export interface AiFunctionPoints {
  [key: string]: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Transaction {
  id: number;
  type: 'RECHARGE' | 'CONSUME' | 'REFUND' | 'BONUS';
  amount: number;
  balanceAfter: number;
  description: string;
  aiFunction?: string;
  createdAt: string;
}

export interface AiUsage {
  id: number;
  functionName: string;
  inputData: string;
  outputData: string;
  pointsConsumed: number;
  executionTimeMs: number;
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING';
  errorMessage?: string;
  createdAt: string;
} 