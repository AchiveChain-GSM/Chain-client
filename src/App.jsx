import { BrowserRouter, Routes, Route } from 'react-router-dom';

import topbar from './components/topbar';
import Login from './Login';
import Timeline from './pages/Timeline.jsx';
import Signup from './pages/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#191919', minHeight: '100vh' }}>
        <topbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Timeline />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
