import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ id와 postId를 둘 다 넣어 데이터 충돌을 방지합니다.
const DUMMY_POSTS = [
  {
    id: 't-1',
    postId: 't-1',
    title: '오늘의 리액트 공부 기록',
    author: '민선',
    description:
      '리액트 컴포넌트 구조와 라우팅을 공부했습니다. 가변형 카드 디자인을 적용해보니 화면이 훨씬 꽉 차 보이네요.',
    tags: ['React', 'TIL'],
    firstImageUrl: 'https://picsum.photos/400/240?random=11',
  },
  {
    id: 't-2',
    postId: 't-2',
    title: '디자인 원복 및 기능 수정',
    author: '민선',
    description:
      '피그마 시안에 맞춰 간격을 158px로 조정하고, 카드 너비를 가변형으로 수정하여 맥북 해상도에 최적화했습니다.',
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
        setPosts(fetchedData.length > 0 ? fetchedData : DUMMY_POSTS);
      } catch (error) {
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
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar onDateChange={(date) => setCurrentDate(date)} />
        </div>

        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
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

                  {/* ✅ xl:4개, 2xl:5개로 설정하여 카드 크기를 작고 이쁘게 유지 */}
                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                    {(keyword ? searchResults : posts).map((item) => (
                      <TimelineCard
                        key={item.id || item.postId}
                        item={item}
                        // ✅ App.jsx의 /posts/:id 와 정확히 일치시킴
                        onClick={() =>
                          navigate(`/posts/${item.id || item.postId}`, {
                            state: { post: item },
                          })
                        }
                      />
                    ))}
                  </div>
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
