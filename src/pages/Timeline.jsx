import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Timeline() {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 추가: 현재 선택된 날짜를 관리하는 상태 (기본값: 오늘)
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);

        // 연도와 월을 추출하여 API 요청 날짜를 생성합니다.
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날 계산
        const formattedMonth = String(month).padStart(2, '0');

        // 하드코딩된 날짜를 변수로 교체 (봇 지적 사항 해결)
        const response = await axios.post('/api/posts/timeline', {
          from: `${year}-${formattedMonth}-01T00:00:00Z`,
          to: `${year}-${formattedMonth}-${lastDay}T23:59:59Z`,
        });

        setPosts(response.data);
      } catch (error) {
        console.error('타임라인 로딩 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [currentDate]); // currentDate가 바뀔 때마다 데이터를 다시 불러옵니다.

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          {/* 캘린더에서 날짜가 바뀔 때 currentDate를 업데이트하도록 연결합니다. */}
          <Calendar onDateChange={(date) => setCurrentDate(date)} />
        </div>

        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #2b2b2b;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #3d3d3d;
              }
            `}</style>

            {/* 현재 보고 있는 월을 동적으로 표시합니다. */}
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              {currentDate.getMonth() + 1}월
            </h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36px] flex flex-col">
              {loading ? (
                <div className="mt-[60px] text-center text-[14px] text-zinc-500">
                  데이터를 불러오는 중...
                </div>
              ) : keyword ? (
                /* 검색어가 있을 때 보여주는 UI */
                <div className="mt-[12px]">
                  <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  {searchResults.length > 0 && (
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {searchResults.map((item) => (
                        <TimelineCard key={item.postId} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* 검색어가 없을 때 보여주는 기본 UI */
                <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {posts.map((item) => (
                    <TimelineCard key={item.postId} item={item} />
                  ))}
                </div>
              )}
            </div>
            <div className="h-[80px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
