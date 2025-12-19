export default function TimelineCard({ item }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-[#1D1D1D]">
      {/* 썸네일 */}
      <div className="h-[160px] w-full bg-zinc-700">
        {/* 나중에 이미지 들어오면 img 태그로 교체 */}
        {/* <img src={item.thumbnail} className="h-full w-full object-cover" /> */}
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-2 p-4">
        {/* 제목 */}
        <h4 className="text-base font-semibold text-white">{item.title}</h4>

        {/* 작성자 */}
        <p className="text-sm text-zinc-400">{item.author}</p>

        {/* 설명 */}
        <p className="line-clamp-2 text-sm text-zinc-400">{item.description}</p>

        {/* 태그 */}
        <div className="mt-2 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-300"
            >
              {tag}
            </span>
          ))}

          {item.tags.length > 3 && (
            <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-300">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
