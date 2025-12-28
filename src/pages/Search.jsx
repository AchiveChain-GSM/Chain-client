import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import api from '../api/axios';

const FILTERS = {
  RECENT: 'recent',
  POPULAR: 'popular',
  VIEWS: 'most-view',
};

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(FILTERS.RECENT);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // ✅ keyword가 있으면 검색 API
        if (keyword.trim()) {
          const res = await api.get('/api/posts/search', {
            params: { keyword: keyword.trim() },
          });
          setPosts(res.data.content || []);
          return;
        }

        // ✅ keyword 없으면 정렬 기준으로 목록
        const endpoint =
          filter === FILTERS.RECENT
            ? '/api/posts/recent'
            : filter === FILTERS.POPULAR
              ? '/api/posts/popular'
              : '/api/posts/most-view';

        const res = await api.get(endpoint);
        setPosts(res.data.content || []);
      } catch (err) {
        console.error('검색 데이터 로딩 실패:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter, keyword]);

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
                    {posts.map((item) => (
                      <TimelineCard
                        key={item.postId}
                        item={item}
                        onClick={() =>
                          navigate(`/posts/${item.postId}`, {
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
