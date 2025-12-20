import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Recent from './pages/Recent'; // ⬅️ 추가 필요!
import Bookmark from './pages/bookmark'; // ⬅️ 추가 필요!

export default function App() {
  return (
    <BrowserRouter>
      {/* 배경색을 #0F0F0F로 맞추면 디자인과 더 잘 맞습니다 */}
      <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} /> {/* ⬅️ 추가! */}
          <Route path="/bookmark" element={<Bookmark />} /> {/* ⬅️ 추가! */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
