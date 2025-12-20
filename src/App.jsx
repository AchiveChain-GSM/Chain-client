import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Recent from './pages/Recent';
// ✅ 소문자 'bookmark'를 대문자 'Bookmark'로 수정합니다.
import Bookmark from './pages/bookmark';

export default function App() {
  return (
    <BrowserRouter>
      {/* 배경색을 #0F0F0F로 설정하여 전체 톤을 맞췄습니다. */}
      <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} />
          {/* ✅ Route 설정은 기존대로 유지해도 컴포넌트 이름(Bookmark)이 대문자면 잘 작동합니다. */}
          <Route path="/bookmark" element={<Bookmark />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
