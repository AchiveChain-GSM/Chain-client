import React from 'react';

export default function TimelineCard({ item }) {
  // 칩 총합을 4개로 맞추기 위해 태그는 최대 3개까지만 노출
  const maxTags = 3;
  const tagsToShow = item?.tags?.slice(0, maxTags) || [];
  const remainingCount = (item?.tags?.length || 0) - maxTags;

  return (
    <div className="group flex w-full flex-col text-white">
      {/* 1. 이미지 영역 (기존 동일) */}
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {item?.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      {/* 2. 텍스트 영역 (기존 동일) */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold text-[#FFFFFF]">
          {item?.title || '제목'}
        </h4>
        <p className="text-[14px] font-light text-[#AAAAAA]">
          {item?.author || '작성자'}
        </p>
        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] font-light text-[#AAAAAA]">
          {item?.description}
        </p>
      </div>

      {/* 3. 태그 영역: 배경 #2E2E2E, 글자 #FFFFFF, 한 줄에 칩 최대 4개 */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {tagsToShow.map((tag, index) => (
          <span
            key={index}
            className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[10px] text-[12px] text-[#FFFFFF]"
          >
            {tag}
          </span>
        ))}
        {/* 남은 개수 표시까지 포함해서 총 칩 개수는 4개가 됨 */}
        {remainingCount > 0 && (
          <span className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[8px] text-[12px] text-[#FFFFFF]">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}
