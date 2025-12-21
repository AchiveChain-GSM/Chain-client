import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Recent from './pages/Recent';
import Bookmark from './pages/bookmark';
import UploadPage from './pages/Upload';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#191919', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path='/upload' element={<UploadPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
