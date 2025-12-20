import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="font-pretendard fixed top-0 left-0 flex w-full items-center justify-center border-b border-[#2F3233] bg-[#1D1D1D]"
      style={{
        height: 'clamp(40px, 3.125vw, 60px)',
        zIndex: 1000,
        padding: '0 clamp(20px, 2.5vw, 48px)',
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className="flex items-center"
          style={{
            gap: 'clamp(4px, 0.4vw, 8px)',
            height: 'clamp(14px, 1.25vw, 24px)',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 'auto',
              height: '100%',
              objectFit: 'contain',
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(8px, 0.625vw, 12px)',
              fontWeight: 300,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.015em',
            }}
          >
            ARCHIVE. CHAIN
          </span>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center transition-opacity hover:opacity-60"
        >
          <img
            src={peopleShape}
            alt="Profile"
            style={{
              width: 'clamp(16px, 1.25vw, 24px)',
              height: 'clamp(16px, 1.25vw, 24px)',
              objectFit: 'contain',
              imageRendering: '-webkit-optimize-contrast',
            }}
          />
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
