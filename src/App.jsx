import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/topbar';
import Login from './pages/Login';
import Timeline from './pages/Timeline.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: '#191919',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '54px',
        }}
      >
        <TopBar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Timeline />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
