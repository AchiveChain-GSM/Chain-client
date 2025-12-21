import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    /* h-[72px]로 디자인 수치 고정 */
    <nav className="fixed top-0 left-0 z-[1000] flex h-[72px] w-full items-center border-b border-[#2F3233] bg-[#1D1D1D] px-[48px]">
      <div className="flex w-full items-center justify-between">
        {/* 로고 영역 */}
        <div className="flex items-center gap-[8px]">
          <img
            src={logo}
            alt="Logo"
            className="h-[24px] w-auto object-contain"
          />
          <span className="text-[12px] font-light tracking-tighter text-white uppercase">
            ARCHIVE. CHAIN
          </span>
        </div>

        {/* 프로필 버튼 */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center transition-opacity hover:opacity-60"
        >
          <img src={peopleShape} alt="Profile" className="h-[24px] w-[24px]" />
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
