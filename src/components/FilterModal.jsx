import React from 'react';
import PencilIcon from '../assets/icon/pencil.svg';
import FilterIcon from '../assets/icon/filtericon.svg';

/**
 * @param {Object} props
 * @param {(newFilter: 'recent'|'views'|'likes'|'today'|'week'|'year') => void} props.onFilterChange
 * @param {() => void=} props.onClose
 */
const FilterModal = ({ onFilterChange = () => {}, onClose }) => {
  const pick = (value) => {
    onFilterChange(value);
    onClose?.();
  };

  // 공통 스타일: 클릭 가능하고 호버 시 밝아짐
  const activeStyle =
    "h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100";

  return (
    <div
      className="relative h-[240px] w-[380px] shadow-2xl transition-all"
      style={{
        backgroundColor: '#1D1D1D',
        borderRadius: '8px',
      }}
    >
      {/* 1. 글 등록 날짜 섹션 (왼쪽) */}
      <div className="absolute top-[28px] left-[32px] flex flex-col">
        <div className="mb-[28px] flex h-[20px] items-center gap-[10px]">
          <img src={PencilIcon} alt="pencil" className="h-[14px] w-[14px]" />
          <span className="text-[16px] leading-[20px] font-light tracking-tight text-[#FFFFFF]">
            글 등록 날짜
          </span>
        </div>

        <ul className="flex flex-col gap-[16px]">
          {/* ✅ 날짜 필터 활성화 */}
          <li onClick={() => pick('today')} className={activeStyle}>
            오늘
          </li>
          <li onClick={() => pick('week')} className={activeStyle}>
            이번 주
          </li>
          <li onClick={() => pick('year')} className={activeStyle}>
            올해
          </li>
        </ul>
      </div>

      {/* 2. 정렬 기준 섹션 (오른쪽) */}
      <div className="absolute top-[28px] flex flex-col" style={{ left: '200px' }}>
        <div className="mb-[28px] flex h-[20px] items-center gap-[10px]">
          <img src={FilterIcon} alt="filter" className="h-[14px] w-[14px]" />
          <span className="text-[16px] leading-[20px] font-light tracking-tight text-[#FFFFFF]">
            정렬 기준
          </span>
        </div>

        <ul className="flex flex-col gap-[16px]">
          <li onClick={() => pick('recent')} className={activeStyle}>
            등록 시간
          </li>
          <li onClick={() => pick('views')} className={activeStyle}>
            조회수
          </li>
          <li onClick={() => pick('likes')} className={activeStyle}>
            좋아요
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FilterModal;