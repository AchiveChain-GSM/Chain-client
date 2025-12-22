import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    /* 1. 높이 가변형 적용: 기본 60px -> 큰 화면(md)에서 72px */
    /* 2. 좌우 여백 가변형 적용: 기본 20px -> 큰 화면(md)에서 48px */
    <nav className="fixed top-0 left-0 z-[1000] flex h-[60px] w-full items-center border-b border-[#2F3233] bg-[#1D1D1D] px-[20px] transition-all duration-300 md:h-[72px] md:px-[48px]">
      {/* 3. 중앙 정렬 및 최대 너비 제한: 너무 넓은 모니터에서 요소가 찢어지는 현상 방지 */}
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between">
        {/* 로고 영역: 텍스트 크기도 화면에 따라 미세하게 조절 */}
        <div className="flex items-center gap-[8px]">
          <img
            src={logo}
            alt="Logo"
            className="h-[20px] w-auto object-contain md:h-[24px]"
          />
          <span className="text-[10px] font-light tracking-tighter whitespace-nowrap text-white uppercase md:text-[12px]">
            ARCHIVE. CHAIN
          </span>
        </div>

        {/* 프로필 버튼: 클릭 영역 최적화 */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center transition-opacity hover:opacity-60"
        >
          <img
            src={peopleShape}
            alt="Profile"
            className="h-[22px] w-[22px] md:h-[24px]"
          />
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
