import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/topbar';

export default function App() {
  return (
    <Router>
      <div
        style={{
          backgroundColor: '#111111',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopBar />
        <Routes>
          <Route path="/" element={null} />
        </Routes>
      </div>
    </Router>
  );
}