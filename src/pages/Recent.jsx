import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';

import { getViewedPosts } from '../api/posts';
import { applyClientSortAndFilter } from '../utils/postClientSort';

export default function Recent() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    let alive = true;

    const fetchRecentData = async () => {
      try {
        setLoading(true);

        // ✅ 데이터만 많이 확보 (정렬은 프론트)
        const data = await getViewedPosts('recent', { page: 0, size: 2000 });
        const fetched = Array.isArray(data) ? data : (data?.content ?? []);

        if (!alive) return;
        setPosts(fetched);
      } catch (err) {
        console.error('최근 본 자료 호출 실패:', err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchRecentData();
    return () => {
      alive = false;
    };
  }, []);

  const displayPosts = useMemo(() => {
    return applyClientSortAndFilter(posts, { filter, keyword });
  }, [posts, filter, keyword]);

  const getFilterName = () => {
    switch (filter) {
      case 'likes':
      case 'popular':
        return '좋아요 많은 순';
      case 'views':
      case 'most-view':
        return '조회수 높은 순';
      case 'today':
        return '오늘';
      case 'week':
        return '이번 주';
      case 'year':
        return '올해';
      default:
        return '최근 본 항목';
    }
  };

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
                  {keyword ? `“${keyword}” 검색결과` : getFilterName()}
                </h3>

                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="z-10 flex items-center justify-center p-1 transition-opacity hover:opacity-70"
                  type="button"
                >
                  <img
                    src={FilterIcon}
                    alt="filter"
                    className="h-[24px] w-[24px]"
                  />
                </button>
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
                  setFilter(newFilter); // ✅ 저장까지 됨
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
