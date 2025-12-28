import React from 'react';

export default function TimelineCard({ item, post, onClick }) {
  // ✅ 어떤 페이지는 item, 어떤 페이지는 post로 넘기니까 둘 다 지원
  const data = item ?? post ?? {};

  const maxTags = 3;
  const tags = Array.isArray(data.tags)
    ? data.tags
        .map((t) =>
          typeof t === 'string' ? t : t?.name ?? t?.tagName ?? t?.value ?? null,
        )
        .map((t) => (t == null ? '' : String(t)))
        .flatMap((t) => t.split(/[\s,]+/g))
        .map((t) => t.trim().replace(/^#+/, ''))
        .filter(Boolean)
    : [];
  const tagsToShow = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  // ✅ author가 string이거나, 객체거나, 다른 필드명일 수 있어서 최대한 방어
  const author =
    (typeof data.author === 'string' && data.author) ||
    data.author?.name ||
    data.userName ||
    data.user?.name ||
    '작성자 미상';

  return (
    <div
      onClick={onClick}
      className="group flex w-full cursor-pointer flex-col text-white"
    >
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {data.firstImageUrl ? (
          <img
            src={data.firstImageUrl}
            alt={data.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold text-[#FFFFFF]">
          {data.title || '제목 없음'}
        </h4>
        <p className="text-[14px] font-light text-[#AAAAAA]">{author}</p>

        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] font-light text-[#AAAAAA]">
          {data.content}
        </p>
      </div>

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
