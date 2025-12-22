import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/bookmark';
import MyData from './pages/mydata'; // ✅ 1. MyData 페이지를 임포트하세요!

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/bookmark" element={<Bookmark />} />
          {/* ✅ 2. 내 자료 페이지 경로를 추가하세요! */}
          <Route path="/mydata" element={<MyData />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
