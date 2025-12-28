import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

        setPosts(fetchedData);
      } catch (error) {
        console.error('타임라인 로딩 에러:', error);
        setPosts([]);
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          * { font-family: 'Pretendard', sans-serif !important; }
        `,
          }}
        />

        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto rounded-xl bg-[#1D1D1D]">
          <div style={{ marginTop: '-12px' }}>
            <Calendar onDateChange={(date) => setCurrentDate(date)} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto">
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

            <div style={{ padding: '24px 0 0 24px' }}>
              <h2
                style={{
                  fontSize: '42px',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                  lineHeight: '1',
                }}
              >
                {currentDate.getMonth() + 1}월
              </h2>

              <div style={{ marginTop: '36px', paddingRight: '24px' }}>
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="flex flex-col px-[24px] pt-[36px]">
              {loading ? (
                <div
                  style={{
                    marginTop: '60px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#71717a',
                  }}
                >
                  데이터를 불러오는 중...
                </div>
              ) : (
                <div className="mt-[12px]">
                  {keyword && (
                    <h3
                      style={{
                        marginBottom: '36px',
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
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
                      <div
                        style={{
                          marginTop: '60px',
                          textAlign: 'center',
                          color: '#52525b',
                        }}
                      >
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
