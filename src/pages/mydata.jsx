import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 1. 이동 도구 추가
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import axios from 'axios';

export default function MyData() {
  const navigate = useNavigate(); // ✅ 2. 이동 함수 선언
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ 에러 피드백을 위한 상태 추가
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    const fetchMyPosts = async () => {
      const userId = localStorage.getItem('userId'); // 🔑 내 자료 조회를 위해 필수

      // ✅ 코드 리뷰 반영: 로그인이 안 된 경우 예외 처리
      if (!userId) {
        setError('로그인이 필요한 서비스입니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 명세서 기반 엔드포인트: /api/posts/written/{userId}/{filter}
        const response = await axios.get(
          `/api/posts/written/${userId}/${filter}`,
        );

        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        setPosts(fetchedData);
      } catch (err) {
        console.error('내 자료 호출 실패:', err);
        setError('자료를 불러오는 중 문제가 발생했습니다.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [filter]);

  const filtered = posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

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
                  <div className="py-10 text-center text-zinc-500">
                    불러오는 중...
                  </div>
                ) : error ? (
                  <div className="py-10 text-center text-red-500">{error}</div>
                ) : (
                  <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {filtered.length === 0 ? (
                      <div className="col-span-full mt-[60px] text-center text-zinc-600">
                        자료가 존재하지 않습니다
                      </div>
                    ) : (
                      filtered.map((item) => (
                        <TimelineCard
                          key={item.postId}
                          item={item}
                          // ✅ 3. 클릭 시 상세 페이지로 이동하며 데이터 전달 추가
                          onClick={() =>
                            navigate(`/post/${item.postId}`, {
                              state: { post: item },
                            })
                          }
                        />
                      ))
                    )}
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
