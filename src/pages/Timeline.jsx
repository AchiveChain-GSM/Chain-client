import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ 임시 데이터 정의
const DUMMY_POSTS = [
  {
    postId: 't-1',
    title: '오늘의 리액트 공부 기록',
    author: '민선',
    tags: ['React', 'TIL'],
    firstImageUrl: 'https://picsum.photos/400/240?random=11',
  },
  {
    postId: 't-2',
    title: '디자인 원복 및 기능 수정',
    author: '민선',
    tags: ['UI', 'Fixed'],
    firstImageUrl: 'https://picsum.photos/400/240?random=12',
  },
];

export default function Timeline() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const lastDay = new Date(year, month, 0).getDate();
        const formattedMonth = String(month).padStart(2, '0');

        const response = await axios.post('/api/posts/timeline', {
          from: `${year}-${formattedMonth}-01T00:00:00Z`,
          to: `${year}-${formattedMonth}-${lastDay}T23:59:59Z`,
        });

        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        // ✅ 서버에 실제 데이터가 있으면 그것을 쓰고, 없으면 임시 데이터를 넣습니다.
        setPosts(fetchedData.length > 0 ? fetchedData : DUMMY_POSTS);
      } catch (error) {
        console.error('타임라인 로딩 에러:', error);
        // ✅ 에러가 났을 때(예: 401 에러)도 화면 확인을 위해 임시 데이터를 보여줍니다.
        setPosts(DUMMY_POSTS);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [currentDate]);

  const searchResults = posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* 캘린더 영역 (민선님 코드 그대로 유지) */}
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar onDateChange={(date) => setCurrentDate(date)} />
        </div>

        {/* 콘텐츠 영역 (민선님 코드 그대로 유지) */}
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
              ) : (
                <div className="mt-[12px]">
                  {keyword && (
                    <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                      “{keyword}” 검색결과
                    </h3>
                  )}

                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {(keyword ? searchResults : posts).map((item) => (
                      <TimelineCard
                        key={item.postId}
                        item={item}
                        onClick={() =>
                          navigate(`/post/${item.postId}`, {
                            state: { post: item },
                          })
                        }
                      />
                    ))}
                  </div>

                  {!loading &&
                    (keyword ? searchResults : posts).length === 0 && (
                      <div className="mt-[60px] text-center text-zinc-600">
                        자료가 존재하지 않습니다.
                      </div>
                    )}
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
