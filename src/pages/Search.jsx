import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import axios from 'axios';

//  임시 데이터 정의
const DUMMY_POSTS = [
  {
    postId: '1',
    title: 'React 프로젝트 구조 잡는 법',
    author: '김철수',
    tags: ['React', 'Architecture'],
    firstImageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    postId: '2',
    title: 'Tailwind CSS 활용 가이드',
    author: '이영희',
    tags: ['CSS', 'Design'],
    firstImageUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    postId: '3',
    title: 'Axios로 API 연동하기',
    author: '박민준',
    tags: ['API', 'Axios'],
    firstImageUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    postId: '4',
    title: '자바스크립트 최신 문법 정리',
    author: '정다은',
    tags: ['JS', 'ES6'],
    firstImageUrl: 'https://picsum.photos/400/300?random=4',
  },
  {
    postId: '5',
    title: 'Git 브랜치 전략 (GitFlow)',
    author: '최요한',
    tags: ['Git', 'Workflow'],
    firstImageUrl: 'https://picsum.photos/400/300?random=5',
  },
];

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  초기값을 임시 데이터로 설정
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('recent');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/posts/${filter}`);
        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        // 서버에 데이터가 있을 때만 덮어씌우기 (없으면 임시 데이터 유지)
        if (fetchedData.length > 0) {
          setPosts(fetchedData);
        }
      } catch (err) {
        console.error('검색 로딩 실패:', err);
        // 에러 시에도 임시 데이터를 보여주고 싶다면 여기서 setPosts([])를 하지 않습니다.
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

  // 키워드 검색 필터링 로직
  const displayPosts = posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="relative flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold text-white">자료 검색</h2>
            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36.5px]">
              <div className="mb-[36px] flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : '전체 자료'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1 transition-opacity hover:opacity-70"
                >
                  {/* 필터 아이콘 크기 수정 완료 */}
                  <img
                    src={FilterIcon}
                    alt="filter"
                    className="h-[24px] w-[24px]"
                  />
                </button>
              </div>

              {loading && posts.length === 0 ? (
                <div className="mt-20 text-center text-zinc-500">
                  데이터 로딩 중...
                </div>
              ) : displayPosts.length === 0 ? (
                <div className="mt-20 text-center text-zinc-600">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {displayPosts.map((item) => (
                    <BaseCard
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
            <div className="h-[100px]" />
          </div>
        </div>

        {isModalOpen && (
          <FilterModal
            onFilterChange={(newFilter) => {
              setFilter(newFilter);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}
