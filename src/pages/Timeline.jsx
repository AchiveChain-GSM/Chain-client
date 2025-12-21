import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    <Layout>
      {/* 화면 전체 패딩 px-[24px], 아래 pb-[24px] */}
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* 1. 캘린더 영역 (390px 고정) */}
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar />
        </div>

        {/* 2. 타임라인 메인 보드 (어두운 박스) */}
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* pt-[48px]로 콘텐츠를 위로 바짝 올림 */}
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            {/* 제목: 12월 (폰트 크게) */}
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              12월
            </h2>

            {/* 제목 - 검색창 사이 간격: 36px */}
            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => console.log(kw)} />
            </div>

            {/* 검색창 - 카드 리스트 사이 간격: 36px */}
            <div className="mt-[36px] flex flex-col">
              {timelineDummy.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className={dayIndex !== 0 ? 'mt-[60px]' : ''}
                >
                  {/* 날짜 텍스트와 아래 카드 사이 간격: 24px */}
                  <h3 className="mb-[24px] text-[18px] font-semibold text-zinc-400">
                    {day.date}
                  </h3>

                  {day.items.length === 0 ? (
                    <div className="py-10 text-sm text-zinc-600">
                      자료가 존재하지 않습니다
                    </div>
                  ) : (
                    /* 카드와 카드 사이 간격(gap): 36px */
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {day.items.map((item) => (
                        <TimelineCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 하단 여백: 스크롤 끝 처리 */}
            <div className="h-[80px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
