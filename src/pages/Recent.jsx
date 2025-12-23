import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import axios from 'axios';

export default function Recent() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const response = await axios.get(
          `/api/posts/viewed/${userId}/${filter}`,
        );
        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];
        setPosts(fetchedData);
      } catch (err) {
        console.error('최근 본 자료 호출 실패:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentData();
  }, [filter]);

  const searchResults = posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  const displayPosts = keyword ? searchResults : posts;

  return (
    <Layout>
      <div className="relative flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto pt-[48px]">
            {/* 스크롤바 스타일 생략 */}
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
                ) : displayPosts.length === 0 ? (
                  <div className="py-10 text-center text-zinc-600">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {displayPosts.map((item) => (
                      <TimelineCard
                        key={item.postId}
                        item={item}
                        // ✅ 수정 포인트: /post/ -> /posts/ 로 경로 변경 및 state 전달
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

        {/* 필터 모달 로직 동일 */}
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
