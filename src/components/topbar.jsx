import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="font-pretendard flex items-center justify-center px-6"
      style={{
        width: '100%',
        maxWidth: '1920px',
        height: '72px',
        backgroundColor: '#1D1D1D',
        borderBottom: '1px solid #2F3233',
        margin: '0 auto',
      }}
    >
      <div
        className="flex items-center"
        style={{ width: '100%', maxWidth: '1793px' }}
      >
        <div className="flex items-center gap-[8px]" style={{ height: '24px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '15px',
              height: '24px',
              objectFit: 'contain',
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
          <span
            style={{
              width: '121px',
              height: '24px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 300,
              lineHeight: '24px',
              letterSpacing: '-0.015em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ARCHIVE. CHAIN
          </span>
        </div>

        <div style={{ width: '1648px' }}></div>

        <div className="flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center transition-opacity hover:opacity-60"
          >
            <img
              src={peopleShape}
              alt="Profile"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
