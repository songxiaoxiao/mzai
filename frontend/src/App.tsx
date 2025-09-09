import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AiFunctions from './pages/AiFunctions';
import Chat from './pages/Chat';
import TextGeneration from './pages/TextGeneration';
import ImageRecognition from './pages/ImageRecognition';
import SpeechToText from './pages/SpeechToText';
import CodeGeneration from './pages/CodeGeneration';
import DocumentSummary from './pages/DocumentSummary';
import MovieClip from './pages/MovieClip';

// 组件
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// 样式
import './index.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* 受保护的路由 */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ai-functions" element={<AiFunctions />} />
              <Route path="chat" element={<Chat />} />
              <Route path="text-generation" element={<TextGeneration />} />
              <Route path="image-recognition" element={<ImageRecognition />} />
              <Route path="speech-to-text" element={<SpeechToText />} />
              <Route path="code-generation" element={<CodeGeneration />} />
              <Route path="document-summary" element={<DocumentSummary />} />
              <Route path="movie-clip" element={<MovieClip />} />
            </Route>
            
            {/* 404页面 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App; 