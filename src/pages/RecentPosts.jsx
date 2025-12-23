import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 하드코딩 방지를 위한 필터 상수화
const FILTERS = {
  DEFAULT: 'default',
  RECENT: 'recent',
  LIKES: 'likes',
  VIEWS: 'views',
};

export default function RecentPosts() {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(FILTERS.DEFAULT);

  // ✅ 하드코딩 해결: 로컬 스토리지에서 유저 ID를 동적으로 가져옵니다.
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // 유저 정보가 없으면 에러를 띄우고 중단합니다.
    if (!userId) {
      setError('로그인이 필요한 서비스입니다.');
      setLoading(false);
      return;
    }

    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 2. 삼항 연산자로 엔드포인트 간결화 및 동적 userId 적용
        const baseEndpoint = `/api/posts/viewed/${userId}`;
        const endpoint =
          filter !== FILTERS.DEFAULT
            ? `${baseEndpoint}/${filter}`
            : baseEndpoint;

        const response = await axios.get(endpoint);
        // 명세서 구조에 맞게 content 추출
        setPosts(response.data.content || []);
      } catch (err) {
        setError('데이터를 불러오는 중 에러가 발생했습니다.');
        console.error('최근 본 자료 로딩 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [filter, userId]);

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  // 3. 필터 옵션 배열 (즐겨찾기 제외하여 UI 깔끔하게 유지)
  const filterOptions = [
    { id: FILTERS.RECENT, label: '등록 시간' },
    { id: FILTERS.VIEWS, label: '조회수' },
    { id: FILTERS.LIKES, label: '좋아요' },
  ];

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold text-white">최근 본 자료</h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36px] flex flex-col">
              {loading ? (
                <div className="mt-[60px] text-center text-zinc-500">
                  데이터 로딩 중...
                </div>
              ) : error ? (
                <div className="mt-[60px] text-center text-red-500">
                  {error}
                </div>
              ) : (
                <>
                  {keyword && (
                    <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                      “{keyword}” 검색결과
                    </h3>
                  )}
                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {(keyword ? searchResults : posts).map((item) => (
                      <TimelineCard key={item.postId} item={item} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 정렬 사이드바 (필터 옵션 동적 생성) */}
        <div className="w-[200px] shrink-0 pt-[48px]">
          <div className="flex flex-col gap-6 rounded-xl bg-[#1D1D1D] p-[24px]">
            <div>
              <p className="mb-4 flex items-center gap-2 font-bold text-white">
                <span className="text-[18px]">⋮≡</span> 정렬 기준
              </p>
              <div className="flex flex-col gap-3 text-[15px]">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={
                      filter === option.id
                        ? 'text-left font-bold text-white'
                        : 'text-left text-zinc-500 hover:text-zinc-300'
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
