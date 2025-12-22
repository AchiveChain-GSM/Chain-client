import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

const AppContent = () => {
  const location = useLocation();
  const hideTopBar = ['/login', '/signup', '/find-password'].includes(
    location.pathname,
  );

  return (
    <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
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
