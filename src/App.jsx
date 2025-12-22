import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/topbar';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/Bookmark';
import MyData from './pages/mydata';
import UploadPage from './pages/Upload';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
        <TopBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/mydata" element={<MyData />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
