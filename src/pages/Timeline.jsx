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

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        // 백엔드 명세서 Request 형식 적용
        const response = await axios.post('/api/posts/timeline', {
          from: '2025-12-01T00:00:00Z',
          to: '2025-12-31T23:59:59Z',
        });
        setPosts(response.data);
      } catch (error) {
        console.error('타임라인 로딩 에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar />
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

            <h2 className="text-[40px] font-bold tracking-tight text-white">
              12월
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
                /* "자료가 없습니다" 문구 제거 */
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
