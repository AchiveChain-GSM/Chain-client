import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { syncAuthHeader } from './api/axios';

// ✅ 새로고침/재진입 시 토큰 → axios 기본헤더 동기화
syncAuthHeader();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
