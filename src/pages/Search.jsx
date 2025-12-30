import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import api from '../api/axios';

import { applyClientSortAndFilter } from '../utils/postClientSort';

const FILTERS = {
  RECENT: 'recent',
  LIKES: 'likes',
  VIEWS: 'views',
  TODAY: 'today',
  WEEK: 'week',
  YEAR: 'year',
};

function pickList(data) {
  if (Array.isArray(data)) return data;
  return data?.content ?? data?.posts ?? [];
}

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 필터 유지

  const [filter, setFilter] = useState(FILTERS.RECENT);
  useEffect(() => {
    let alive = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const kw = keyword.trim();

        const commonParams = { page: 0, size: 2000 };

        // 1) 검색어가 있으면 search API
        if (kw) {
          const res = await api.get('/api/posts/search', {
            params: { keyword: kw, q: kw, query: kw, ...commonParams },
          });
          if (!alive) return;
          setPosts(pickList(res.data));
          return;
        }

        // 2) 검색어 없으면 그냥 recent로 많이 가져오기
        const res = await api.get('/api/posts/recent', {
          params: commonParams,
        });
        if (!alive) return;
        setPosts(pickList(res.data));
      } catch (err) {
        const status = err?.response?.status;
        console.error(
          '검색 데이터 로딩 실패:',
          status,
          err?.response?.data ?? err,
        );

        if (status === 401) {
          navigate('/login');
          return;
        }
        if (alive) setPosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      alive = false;
    };
  }, [keyword, navigate]);

  // ✅ 정렬/날짜필터/검색 모두 프론트 처리
  const displayPosts = useMemo(() => {
    return applyClientSortAndFilter(posts, { filter, keyword });
  }, [posts, filter, keyword]);

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
                자료 검색
              </h2>
              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="mt-[36.5px]">
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : '전체 자료'}
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
                  <div className="mt-[60px] text-center text-zinc-500">
                    데이터 로딩 중...
                  </div>
                ) : displayPosts.length === 0 ? (
                  <div className="mt-[60px] text-center text-zinc-600">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {displayPosts.map((item) => (
                      <TimelineCard
                        key={item.postId ?? item.id}
                        item={item}
                        onClick={() =>
                          navigate(`/posts/${item.postId ?? item.id}`, {
                            state: { post: item },
                          })
                        }
                      />
                    ))}
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
                  setFilter(newFilter); // ✅ 저장됨
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
