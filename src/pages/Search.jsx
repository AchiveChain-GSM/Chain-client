import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import FilterIcon from '../assets/icon/filter.svg';
import axios from 'axios';

// ✅ 상세 페이지 연결을 위해 본문(description) 데이터를 보강한 임시 데이터
const DUMMY_POSTS = [
  {
    postId: '1',
    title: 'React 프로젝트 구조 잡는 법',
    author: '김철수',
    description:
      '효율적인 리액트 프로젝트 아키텍처 설계를 위한 폴더 구조와 컴포넌트 분리 전략을 알아봅니다.',
    tags: ['React', 'Architecture'],
    firstImageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    postId: '2',
    title: 'Tailwind CSS 활용 가이드',
    author: '이영희',
    description:
      'Tailwind CSS를 사용하여 유틸리티 퍼스트 방식으로 빠르게 스타일링하는 팁을 공유합니다.',
    tags: ['CSS', 'Design'],
    firstImageUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    postId: '3',
    title: 'Axios로 API 연동하기',
    author: '박민준',
    description:
      'Axios 라이브러리를 활용하여 REST API와 통신하고 데이터를 처리하는 표준적인 방법을 공부합니다.',
    tags: ['API', 'Axios'],
    firstImageUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    postId: '4',
    title: '자바스크립트 최신 문법 정리',
    author: '정다은',
    description:
      'ES6 이후 도입된 자바스크립트의 최신 문법들을 실제 코드 예제와 함께 정리했습니다.',
    tags: ['JS', 'ES6'],
    firstImageUrl: 'https://picsum.photos/400/300?random=4',
  },
  {
    postId: '5',
    title: 'Git 브랜치 전략 (GitFlow)',
    author: '최요한',
    description:
      '협업 효율을 높여주는 GitFlow 전략의 핵심 개념과 실제 적용 사례를 소개합니다.',
    tags: ['Git', 'Workflow'],
    firstImageUrl: 'https://picsum.photos/400/300?random=5',
  },
];

export default function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

        if (fetchedData.length > 0) {
          setPosts(fetchedData);
        }
      } catch (err) {
        console.error('검색 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [filter]);

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
                      // ✅ /post/ -> /posts/ 로 경로 수정 완료 (App.jsx 라우트와 일치)
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
