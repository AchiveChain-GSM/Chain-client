import React from 'react';
import PencilIcon from '../assets/icon/pencil.svg';
import FilterIcon from '../assets/icon/filtericon.svg';

const FilterModal = () => {
  return (
    <div
      className="relative h-[240px] w-[380px] shadow-2xl transition-all"
      style={{
        backgroundColor: '#1D1D1D',
        borderRadius: '8px', //
      }}
    >
      {/* 1. 글 등록 날짜 섹션 (왼쪽) */}
      <div className="absolute top-[28px] left-[32px] flex flex-col">
        {/* 타이틀: 크기 16px, 높이 20px, 아이콘 14x14 */}
        <div className="mb-[28px] flex h-[20px] items-center gap-[10px]">
          <img src={PencilIcon} alt="pencil" className="h-[14px] w-[14px]" />
          <span className="text-[16px] leading-[20px] font-light tracking-tight text-[#FFFFFF]">
            글 등록 날짜
          </span>
        </div>

        {/* 리스트: 간격 16px, 크기 16px */}
        <ul className="flex flex-col gap-[16px]">
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            오늘
          </li>
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            이번 주
          </li>
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            올해
          </li>
        </ul>
      </div>

      {/* 2. 정렬 기준 섹션 (오른쪽: 비율에 맞춰 왼쪽에서 200px 지점) */}
      <div
        className="absolute top-[28px] flex flex-col"
        style={{ left: '200px' }} // 전체 너비가 줄어듦에 따라 시작 위치 조정
      >
        <div className="mb-[28px] flex h-[20px] items-center gap-[10px]">
          <img src={FilterIcon} alt="filter" className="h-[14px] w-[14px]" />
          <span className="text-[16px] leading-[20px] font-light tracking-tight text-[#FFFFFF]">
            정렬 기준
          </span>
        </div>

        <ul className="flex flex-col gap-[16px]">
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            등록 시간
          </li>
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            조회수
          </li>
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            좋아요
          </li>
          <li className="h-[20px] cursor-pointer text-[16px] leading-[20px] font-light text-[#FFFFFF] opacity-70 transition-opacity hover:opacity-100">
            즐겨찾기
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FilterModal;
