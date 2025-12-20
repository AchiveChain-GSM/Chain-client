import TopBar from '../components/topbar';
import Sidebar from '../components/sidebar';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0F0F0F] text-white">
      {/* TopBar (고정) */}
      <TopBar />

      {/* TopBar 아래 간격: 45px */}
      <div className="flex w-full pt-[45px]">
        {/* Sidebar */}
        <div className="w-[234px] shrink-0">
          <Sidebar />
        </div>

        {/* Calendar + Timeline 영역 */}
        <div
          className="flex gap-[18px] pl-[18px]"
          style={{ height: 'calc(100vh - 117px)' }}
          // 72(topbar) + 45(gap)
        >
          {/* Calendar (자체 스크롤) */}
          <div className="w-[390px] shrink-0 overflow-y-auto">
            <Calendar />
          </div>

          {/* Timeline 콘텐츠 */}
          <main className="w-[1248px] overflow-hidden rounded-xl bg-[#1D1D1D]">
            <div className="h-full overflow-y-auto px-[18px] pt-[76px]">
              {/* 월 제목 */}
              <h2 className="text-[28px] font-semibold">12월</h2>

              {/* 월 ↔ 검색창 (27px) */}
              <div className="mt-[27px]">
                <SearchInput
                  initialValue=""
                  onSearch={(kw) => console.log('search:', kw)}
                />
              </div>

              {/* 검색창 ↔ 날짜/카드 영역 */}
              <div className="mt-[27px] flex flex-col gap-[27px]">
                {timelineDummy.map((day) => (
                  <div key={day.date}>
                    {/* 날짜 */}
                    <h3 className="mb-[18px] text-sm text-zinc-400">
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
                          gap: '27px',
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

              {/* 하단 여백 */}
              <div className="h-[36px]" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
