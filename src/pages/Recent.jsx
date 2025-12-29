import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import { getViewedPosts } from '../api/posts';
import { getCurrentUser } from '../api/auth';

export default function Recent() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent'); // recent | popular | most-view 등

  useEffect(() => {
    let alive = true;

    const fetchRecentData = async () => {
      const user = getCurrentUser();
      if (!user?.isAuthenticated) {
        if (!alive) return;
        console.error('로그인 정보가 없습니다.');
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        if (!alive) return;
        setLoading(true);

        // ✅ getViewedPosts(sort, params) 형태에 맞춤
        const data = await getViewedPosts(filter, {
          page: 0,
          size: 200,
          // 서버가 Pageable sort를 받으면 적용, 아니면 무시해도 무방
          sort: 'createAt,desc',
        });

        const fetched = Array.isArray(data) ? data : data?.content ?? [];

        if (!alive) return;
        setPosts(fetched);
      } catch (err) {
        console.error('최근 본 자료 호출 실패:', err);
        if (alive) setPosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchRecentData();
    return () => {
      alive = false;
    };
  }, [filter]);

  const displayPosts = (keyword ? posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  ) : posts);

  return (
    <Layout>
      <div className="relative flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto pt-[48px]">
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

            <div className="px-[32px]">
              <h2 className="text-[40px] font-bold tracking-tight text-white">
                최근 본 자료
              </h2>
              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="mt-[36.5px]">
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : '최근 본 항목'}
                </h3>

                
              </div>

              <div className="px-[32px]">
                {loading ? (
                  <div className="py-10 text-center text-zinc-500">
                    데이터를 불러오는 중...
                  </div>
                ) : displayPosts.length === 0 ? (
                  <div className="py-10 text-center text-zinc-600">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {displayPosts.map((item) => {
                      const pid = item?.postId ?? item?.id;
                      return (
                        <TimelineCard
                          key={pid}
                          item={item}
                          onClick={() =>
                            navigate(`/posts/${pid}`, {
                              state: { post: item },
                            })
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="h-[100px]" />
          </div>
        </div>

        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <div
              className="absolute z-50 shadow-2xl"
              style={{ top: '201px', right: '72px' }}
            >
              <FilterModal
                onFilterChange={(newFilter) => {
                  setFilter(newFilter);
                  setIsModalOpen(false);
                }}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
