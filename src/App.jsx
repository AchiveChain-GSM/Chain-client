import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios'; // 1. axios 추가
import TopBar from './components/topbar';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/Bookmark';
import MyData from './pages/mydata';
import UploadPage from './pages/Upload';
import FindPassword from './pages/Findps';
import PostDetail from './pages/PostDetail';

// 2. axios 전역 주소 설정 (.env에 넣은 주소를 가져옵니다)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const AppContent = () => {
  const location = useLocation();
  const hideTopBar = ['/login', '/signup', '/find-password'].includes(
    location.pathname,
  );

  return (
    <div style={{ backgroundColor: '#1d1d1d', minHeight: '100vh' }}>
      {!hideTopBar && <TopBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Timeline />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recent" element={<Recent />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/mydata" element={<MyData />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
