// src/components/TimelineCard.jsx
export default function TimelineCard({ item }) {
  return (
    <div className="flex w-full flex-col text-white">
      {/* 1. 이미지 영역: 200x120 비율 유지 (aspect-video 활용) */}
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" /> // 이미지 없을 때 대비
        )}
      </div>

      {/* 2. 텍스트 영역 (mt-12px) */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[16px] leading-tight font-bold">
          {item.title}
        </h4>
        <p className="text-[14px] text-zinc-500">{item.author}</p>
        <p className="mt-[4px] line-clamp-2 text-[14px] leading-snug text-zinc-400">
          {item.description}
        </p>
      </div>

      {/* 3. 태그 영역 (mt-12px) */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {item.tags?.map((tag, index) => (
          <span
            key={index}
            className="rounded-full bg-[#2A2A2A] px-[10px] py-[4px] text-[12px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
