import React from 'react';

export default function TimelineCard({ item, onClick }) {
  // 태그는 3개까지만 깔끔하게 표시
  const maxTags = 3;
  const tagsToShow = item?.tags?.slice(0, maxTags) || [];

  return (
    <div
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col"
    >
      {/* 1. 이미지 영역 (기존 비율 유지) */}
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {item?.firstImageUrl ? (
          <img
            src={item.firstImageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      {/* 2. 텍스트 영역 (제목, 작성자, 본문) */}
      <div className="mt-[12px]">
        <h4 className="truncate text-[18px] font-semibold text-white">
          {item?.title || '제목 없음'}
        </h4>
        <p className="mt-[2px] text-[14px] text-[#AAAAAA]">
          {item?.author || '작성자 미상'}
        </p>

        {/* ✅ 본문 미리보기: 이미지 시안처럼 2줄 노출 */}
        <p className="mt-[8px] line-clamp-2 h-[40px] text-[14px] leading-relaxed font-light text-[#888888]">
          {item?.content || item?.description || '내용이 없습니다.'}
        </p>
      </div>

      {/* 3. 태그 영역 (기존 둥근 디자인) */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {tagsToShow.map((tag, index) => (
          <span
            key={index}
            className="rounded-full bg-[#2E2E2E] px-[8px] py-[2px] text-[11px] text-[#FFFFFF]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
