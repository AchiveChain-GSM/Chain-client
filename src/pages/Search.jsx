import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import api from '../api/axios';
import usePersistedState from '../utils/usePersistedState';

import {
  POST_FILTER,
  normalizeFilterKey,
  getFilterLabel,
} from '../utils/postFilters';
import { applyDateFilter } from '../utils/dateFilters';

const LIST_ENDPOINT_BY_FILTER = {
  [POST_FILTER.RECENT]: '/api/posts/recent',
  [POST_FILTER.LIKES]: '/api/posts/popular',
  [POST_FILTER.VIEWS]: '/api/posts/most-view',
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
 const [filter, setFilter] = usePersistedState(
   'filter:search',
   POST_FILTER.RECENT,
   'local',
 );

  useEffect(() => {
    let alive = true;

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const kw = keyword.trim();
        const commonParams = { page: 0, size: 2000 };

        // 1) 검색어 있으면 검색 API
        if (kw) {
          const res = await api.get('/api/posts/search', {
            params: { keyword: kw, ...commonParams },
          });
          if (!alive) return;
          setPosts(pickList(res.data));
          return;
        }

        // 2) 검색어 없으면 필터별 목록 endpoint
        const baseKey =
          filter === POST_FILTER.TODAY ||
          filter === POST_FILTER.WEEK ||
          filter === POST_FILTER.YEAR
            ? POST_FILTER.RECENT
            : filter;

        const endpoint =
          LIST_ENDPOINT_BY_FILTER[baseKey] ??
          LIST_ENDPOINT_BY_FILTER[POST_FILTER.RECENT];

        const res = await api.get(endpoint, { params: commonParams });
        let list = pickList(res.data);

        // 3) 날짜 필터는 클라 적용
        list = applyDateFilter(list, filter);

        if (!alive) return;
        setPosts(list);
      } catch (err) {
        const status = err?.response?.status;
        console.error('검색 데이터 로딩 실패:', status, err?.response?.data ?? err);

        if (status === 401) {
          navigate('/login');
          return;
        }

        if (!alive) return;
        setPosts([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      alive = false;
    };
  }, [filter, keyword, navigate]);

  const titleText = useMemo(() => {
    if (keyword.trim()) return `“${keyword.trim()}” 검색결과`;
    return getFilterLabel(filter);
  }, [keyword, filter]);

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
                  {titleText}
                </h3>
                <button
                  onClick={() => setIsModalOpen((v) => !v)}
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
                ) : posts.length === 0 ? (
                  <div className="mt-[60px] text-center text-zinc-600">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {posts.map((item) => {
                      const postId = item?.postId ?? item?.id;
                      return (
                        <TimelineCard
                          key={postId ?? `${item?.title}-${item?.createAt ?? ''}`}
                          item={item}
                          onClick={() =>
                            navigate(`/posts/${postId}`, {
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
