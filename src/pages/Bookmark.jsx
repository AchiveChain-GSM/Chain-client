import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import { getBookmarkedPosts } from '../api/posts';

export default function Bookmark() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await getBookmarkedPosts(filter, { size: 200, page: 0 });
        const fetchedData = Array.isArray(data) ? data : data?.content || [];

        setPosts(fetchedData);
      } catch (err) {
        console.error('즐겨찾기 목록 호출 실패:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [filter]);

  const filteredItems = posts.filter((item) =>
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
                즐겨찾기
              </h2>
              <div className="mt-[36px]">
                <SearchInput
                  initialValue={keyword}
                  onSearch={(kw) => setKeyword(kw)}
                />
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
                    데이터를 불러오는 중...
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {filteredItems.length === 0 ? (
                      <div className="col-span-full">
                        <div className="mt-[60px] text-center text-zinc-600">
                          {keyword
                            ? '검색 결과가 없습니다.'
                            : '즐겨찾기한 자료가 없습니다.'}
                        </div>
                      </div>
                    ) : (
                      filteredItems.map((item) => {
                        const postId = item?.postId ?? item?.id;
                        return (
                          <TimelineCard
                            key={postId}
                            item={item}
                            onClick={() =>
                              navigate(`/posts/${postId}`, {
                                state: { post: item },
                              })
                            }
                          />
                        );
                      })
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
