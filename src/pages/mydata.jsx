import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import api from '../api/axios';

import { applyClientSortAndFilter } from '../utils/postClientSort';

const FILTER_TO_ENDPOINT = {
  recent: '/api/posts/written/recent',
  likes: '/api/posts/written/likes',
  views: '/api/posts/written/views',
  default: '/api/posts/written',
};

function pickContent(data) {
  if (Array.isArray(data)) return data;
  return data?.content ?? [];
}

export default function MyData() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 필터 유지
  const [filter, setFilter] = useState('recent');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError('');

        // MyData는 엔드포인트가 나뉘어 있으니 일단 유지
        const endpoint =
          FILTER_TO_ENDPOINT[filter] ?? FILTER_TO_ENDPOINT.default;

        const res = await api.get(endpoint, {
          params: { page: 0, size: 2000 },
        });
        setPosts(pickContent(res.data));
      } catch (e) {
        console.error('내 자료 호출 실패:', e);
        setError('자료를 불러오는 중 문제가 발생했습니다.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [filter]);

  // ✅ 프론트 정렬/검색 (MyData는 today/week/year 안 써도 됨)
  const displayPosts = useMemo(() => {
    return applyClientSortAndFilter(posts, { filter, keyword });
  }, [posts, filter, keyword]);

  return (
    <Layout>
      <div className="relative flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto pt-[48px]">
            <div className="px-[32px]">
              <h2 className="text-[40px] font-bold tracking-tight text-white">
                내 자료
              </h2>
              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="mt-[36.5px]">
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : ''}
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
                  <div className="py-10 text-center text-zinc-500">
                    불러오는 중...
                  </div>
                ) : error ? (
                  <div className="py-10 text-center text-zinc-600">{error}</div>
                ) : displayPosts.length === 0 ? (
                  <div className="py-10 text-center text-zinc-600">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
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
