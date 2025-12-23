import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import axios from 'axios';

const FILTERS = {
  RECENT: 'recent',
  POPULAR: 'popular',
  VIEWS: 'most-view',
};

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 테스트를 위해 초기값에 가짜 데이터를 넣었습니다.
  const [posts, setPosts] = useState([
    {
      postId: 'test-1',
      title: '서버 연결 전 테스트 자료 1',
      author: '개발자민선',
      content: '이것은 첫 번째 테스트용 본문 내용입니다.',
      tags: ['React', '테스트'],
      firstImageUrl: 'https://picsum.photos/400/240?random=1',
    },
    {
      postId: 'test-2',
      title: '상세보기 연결 확인용 자료 2',
      author: 'Gemini',
      content: '카드를 클릭하면 상세 페이지로 잘 이동하는지 확인하세요!',
      tags: ['UI', '연동확인'],
      firstImageUrl: 'https://picsum.photos/400/240?random=2',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(FILTERS.RECENT);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${filter}`);
        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        // 서버에 실제 데이터가 있다면 서버 데이터를 쓰고, 없으면 지금은 더미를 유지합니다.
        if (fetchedData.length > 0) {
          setPosts(fetchedData);
        }
      } catch (err) {
        console.error('검색 데이터 로딩 실패 (서버가 아직 준비 안됨):', err);
        // 에러가 나도 테스트 데이터는 유지되도록 setPosts([])를 잠시 주석처리 하셔도 됩니다.
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
                  {keyword ? `“${keyword}” 검색결과` : '전체 자료 (테스트용)'}
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
                {loading && posts.length === 0 ? (
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
                        key={item.postId}
                        item={item}
                        onClick={() =>
                          navigate(`/post/${item.postId}`, {
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
