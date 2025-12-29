import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';

import { getViewedPosts } from '../api/posts';

import {
  POST_FILTER,
  normalizeFilterKey,
  getFilterLabel,
} from '../utils/postFilters';
import { applyDateFilter } from '../utils/dateFilters';

function pickContent(data) {
  if (Array.isArray(data)) return data;
  return data?.content ?? data?.posts ?? [];
}

export default function Recent() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 표준키
  const [filter, setFilter] = useState(POST_FILTER.RECENT);

  useEffect(() => {
    let alive = true;

    const fetchRecentData = async () => {
      try {
        setLoading(true);

        // today/week/year는 viewed endpoint가 없을 확률이 높으니 recent로 받아오고 클라에서 자르기
        const baseKey =
          filter === POST_FILTER.TODAY ||
          filter === POST_FILTER.WEEK ||
          filter === POST_FILTER.YEAR
            ? POST_FILTER.RECENT
            : filter;

        const data = await getViewedPosts(baseKey, { page: 0, size: 2000 });
        let list = pickContent(data);

        list = applyDateFilter(list, filter);

        if (!alive) return;
        setPosts(list);
      } catch (err) {
        console.error('최근 본 자료 호출 실패:', err);
        // 실패 시 기존 posts 유지
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchRecentData();
    return () => {
      alive = false;
    };
  }, [filter]);

  const displayPosts = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return posts;
    return posts.filter((item) =>
      (item.title ?? '').toLowerCase().includes(kw),
    );
  }, [posts, keyword]);

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
                  {keyword ? `“${keyword}” 검색결과` : ' '}
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
                          key={pid ?? `${item?.title}-${item?.createAt ?? ''}`}
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
                onFilterChange={(raw) => {
                  setFilter(normalizeFilterKey(raw));
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
