import TopBar from '../components/topbar';
import Sidebar from '../components/sidebar';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0F0F0F] text-white">
      {/* TopBar */}
      <TopBar />

      {/* TopBar 아래 정확히 60px */}
      <div className="flex w-full pt-[60px]">
        {/* Sidebar (고정 폭) */}
        <div className="w-[234px] shrink-0">
          <Sidebar />
        </div>

        {/* Calendar + Timeline 영역 */}
        <div
          className="flex gap-[24px] pl-[24px]"
          style={{ height: 'calc(100vh - 132px)' }} // 72 + 60
        >
          {/* Calendar */}
          <div className="w-[390px] shrink-0 overflow-y-auto">
            <Calendar />
          </div>

          {/* Timeline */}
          <main className="w-[1248px] overflow-hidden rounded-xl bg-[#1D1D1D]">
            <div className="h-full overflow-y-auto px-[24px] pt-[102px]">
              {/* 월 제목 */}
              <h2 className="text-[28px] font-semibold">12월</h2>

              {/* 월 ↔ 검색창 36 */}
              <div className="mt-[36px]">
                <SearchInput
                  initialValue=""
                  onSearch={(kw) => console.log(kw)}
                />
              </div>

              {/* 검색창 ↔ 카드 영역 */}
              <div className="mt-[36px] flex flex-col gap-[36px]">
                {timelineDummy.map((day) => (
                  <div key={day.date}>
                    <h3 className="mb-[24px] text-sm text-zinc-400">
                      {day.date}
                    </h3>

                    {day.items.length === 0 ? (
                      <div className="text-sm text-zinc-500">
                        자료가 존재하지 않습니다
                      </div>
                    ) : (
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: 'repeat(5, 200px)',
                          gap: '36px',
                        }}
                      >
                        {day.items.map((item) => (
                          <TimelineCard key={item.id} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="h-[48px]" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
