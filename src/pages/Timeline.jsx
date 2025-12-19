import TimelineCard from '../components/TimelineCard';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    /* 🔹 전체 배경: 거의 블랙 */
    <div className="min-h-screen w-full bg-[#0F0F0F] text-white">
      {/* 🔹 Topbar가 있다면 그 아래 영역 */}
      <div className="flex h-[calc(100vh-56px)] gap-4 p-4">
        {/* 🔹 Sidebar */}
        <aside className="w-56 shrink-0 rounded-xl bg-[#1D1D1D] p-4">
          Sidebar
        </aside>

        {/* 🔹 Calendar */}
        <section className="w-80 shrink-0 rounded-xl bg-[#1D1D1D] p-4">
          Calendar
        </section>

        {/* 🔹 Timeline (배경 없음, 카드만 떠 있음) */}
        <main className="flex-1 overflow-y-auto">
          {/* 월 헤더 */}
          <h2 className="mb-6 text-lg font-semibold">12월</h2>

          {/* 날짜별 섹션 */}
          <div className="flex flex-col gap-10">
            {timelineDummy.map((day) => (
              <div key={day.date}>
                {/* 날짜 */}
                <h3 className="mb-4 text-sm text-zinc-400">{day.date}</h3>

                {/* 카드 or 빈 상태 */}
                {day.items.length === 0 ? (
                  <div className="text-sm text-zinc-500">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {day.items.map((item) => (
                      <TimelineCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
