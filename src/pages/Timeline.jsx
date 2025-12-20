import TopBar from '../components/topbar';
import Sidebar from '../components/sidebar';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    <div className="min-h-screen w-full bg-[#0F0F0F] text-white">
      {/* Topbar */}
      <TopBar />

      {/* Topbar 아래 영역 */}
      <div className="flex h-[calc(100vh-44px)] gap-4 p-4">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <Sidebar />
        </div>

        {/* Calendar (아직 임시) */}
        <section className="w-80 shrink-0 rounded-xl bg-[#1D1D1D] p-4">
          Calendar
        </section>

        {/* Timeline */}
        <main className="flex-1 overflow-y-auto rounded-xl bg-[#1D1D1D] p-6">
          <h2 className="mb-6 text-lg font-semibold">12월</h2>

          <div className="flex flex-col gap-10">
            {timelineDummy.map((day) => (
              <div key={day.date}>
                <h3 className="mb-3 text-sm text-zinc-400">{day.date}</h3>

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
