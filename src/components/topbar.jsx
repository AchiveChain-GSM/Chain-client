import React from 'react';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';

const TopBar = () => {
  return (
    <nav
      className="font-pretendard flex items-center justify-between px-6"
      style={{
        width: '100%',
        maxWidth: '1920px',
        height: '44px',
        backgroundColor: '#111111',
        borderBottom: '1px solid #2F3233',
        margin: '0 auto',
      }}
    >
      <div className="flex items-center gap-[8px]">
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '12px',
            height: '18px',
            objectFit: 'contain',
            imageRendering: '-webkit-optimize-contrast',
          }}
        />
        <span
          style={{
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: '120%',
            letterSpacing: '-0.015em',
            textTransform: 'uppercase',
          }}
        >
          ARCHIVE. CHAIN
        </span>
      </div>

      <div className="flex items-center">
        <button className="transition-opacity hover:opacity-60">
          <img
            src={peopleShape}
            alt="Profile"
            style={{
              width: '18px',
              height: '18px',
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
