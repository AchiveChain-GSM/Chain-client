import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline'; // 경로 pages로 수정 & 대문자 T
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/Bookmark'; // 대문자 B
import MyData from './pages/mydata'; // 파일명에 맞춰 소문자 m

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
          <Route path="/mydata" element={<MyData />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
