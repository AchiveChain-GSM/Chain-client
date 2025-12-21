import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Timeline from './pages/Timeline';
import Search from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#191919', minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
