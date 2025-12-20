import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/topbar';

const App = () => {
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
};

export default App;
