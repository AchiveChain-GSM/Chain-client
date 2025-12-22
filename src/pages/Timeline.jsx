import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react'; // ✅ 상태 관리를 위해 추가

export default function Timeline() {
  const [keyword, setKeyword] = useState(''); // ✅ 검색어 상태 추가

  // 전체 데이터에서 검색어에 맞는 아이템만 필터링
  const allItems = timelineDummy.flatMap((day) => day.items);
  const searchResults = allItems.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* 1. 캘린더 영역 */}
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar />
        </div>

        {/* 2. 타임라인 메인 보드 */}
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              12월
            </h2>

            <div className="mt-[36px]">
              {/* ✅ 검색어 입력을 keyword 상태에 연결 */}
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36px] flex flex-col">
              {/* ✅ 검색어가 있을 때: "검색결과" 섹션 표시 */}
              {keyword ? (
                <div className="mt-[12px]">
                  <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  {searchResults.length === 0 ? (
                    <div className="mt-[60px] text-center text-zinc-600">
                      검색 결과가 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {searchResults.map((item) => (
                        <TimelineCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* ✅ 검색어가 없을 때: 기존 날짜별 타임라인 표시 */
                timelineDummy.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={dayIndex !== 0 ? 'mt-[60px]' : ''}
                  >
                    <h3 className="mb-[24px] text-[18px] font-semibold text-zinc-400">
                      {day.date}
                    </h3>
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {day.items.map((item) => (
                        <TimelineCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="h-[80px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
