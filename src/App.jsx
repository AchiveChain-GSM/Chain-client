import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/Bookmark';
import MyData from './pages/mydata'; // 민선님 페이지 파일명 소문자 m 확인
import UploadPage from './pages/Upload'; // 친구가 새로 추가한 페이지

export default function App() {
  return (
    <BrowserRouter>
      {/* 배경색은 민선님이 설정한 진한 블랙(#0F0F0F)으로 유지합니다 */}
      <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/mydata" element={<MyData />} /> {/* 민선님 경로 */}
          <Route path="/upload" element={<UploadPage />} />{' '}
          {/* 친구 추가 경로 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
