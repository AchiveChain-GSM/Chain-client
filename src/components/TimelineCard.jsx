import React from 'react';

// ✅ onClick 프롭을 추가하여 외부(Search, Timeline 등)에서 넘겨준 이동 함수를 받습니다.
export default function TimelineCard({ item, onClick }) {
  // 1. 태그 처리: 명세서의 'tags' 배열 사용
  const maxTags = 3;
  const tagsToShow = item?.tags?.slice(0, maxTags) || [];
  const remainingCount = (item?.tags?.length || 0) - maxTags;

  return (
    <div
      // ✅ 클릭 이벤트 연결 및 커서 모양 변경
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col text-white"
    >
      {/* 1. 이미지 영역: 명세서의 'firstImageUrl' 사용 */}
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

      {/* 2. 텍스트 영역: 명세서의 'title', 'author' 사용 */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold text-[#FFFFFF]">
          {item?.title || '제목 없음'}
        </h4>
        <p className="text-[14px] font-light text-[#AAAAAA]">
          {item?.author || '작성자 미상'}
        </p>
        {/* 명세서의 'content'를 요약해서 보여줌 */}
        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] font-light text-[#AAAAAA]">
          {item?.content}
        </p>
      </div>

      {/* 3. 태그 영역: 배경 #2E2E2E, 글자 #FFFFFF */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {tagsToShow.map((tag, index) => (
          <span
            key={index}
            className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[10px] text-[12px] text-[#FFFFFF]"
          >
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[8px] text-[12px] text-[#FFFFFF]">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}
