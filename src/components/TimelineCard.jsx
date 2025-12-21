export default function TimelineCard({ item }) {
  return (
    <div className="flex h-[278px] w-[200px] flex-col overflow-hidden rounded-xl bg-[#1D1D1D]">
      {' '}
      {/* ✅ CHANGED */}
      <div className="h-[160px] w-full bg-zinc-700" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h4 className="text-base font-semibold text-white">{item.title}</h4>

        <p className="text-sm text-zinc-400">{item.author}</p>

        <p className="line-clamp-2 text-sm text-zinc-400">{item.description}</p>

        <div className="mt-auto flex flex-wrap gap-2">
          {' '}
          {/* ✅ CHANGED: 아래로 밀리게 */}
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={`${tag}-${index}`}
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
