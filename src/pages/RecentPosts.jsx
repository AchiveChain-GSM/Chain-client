import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecentPosts() {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 정렬 상태 관리 (기본값: 최근 본 자료)
  const [filter, setFilter] = useState('default');

  // 유저 ID (로그인 정보가 없다면 임시로 1 사용)
  const userId = 1;

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);

        // .env에 설정한 VITE_API_BASE_URL이 있다면 자동으로 붙습니다.
        // 정렬 필터에 따른 API 엔드포인트 선택
        let endpoint = `/api/posts/viewed/${userId}`;
        if (filter === 'recent')
          endpoint = `/api/posts/viewed/${userId}/recent`;
        if (filter === 'likes') endpoint = `/api/posts/viewed/${userId}/likes`;
        if (filter === 'views') endpoint = `/api/posts/viewed/${userId}/views`;

        const response = await axios.get(endpoint);

        // 중요: 명세서 구조상 response.data.content가 실제 포스트 배열입니다.
        setPosts(response.data.content || []);
      } catch (error) {
        console.error('최근 본 자료 로딩 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [filter, userId]); // filter가 바뀔 때마다 API를 새로 호출합니다.

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* 중앙 메인 영역 */}
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
            <div className="h-[80px]" />
          </div>
        </div>

        {/* 오른쪽 정렬 사이드바 (캡처 이미지 디자인 반영) */}
        <div className="w-[200px] shrink-0 pt-[48px]">
          <div className="flex flex-col gap-6 rounded-xl bg-[#1D1D1D] p-[24px]">
            <div>
              <p className="mb-4 flex items-center gap-2 font-bold text-white">
                <span className="text-[18px]">⋮≡</span> 정렬 기준
              </p>
              <div className="flex flex-col gap-3 text-[15px]">
                <button
                  onClick={() => setFilter('recent')}
                  className={
                    filter === 'recent'
                      ? 'font-bold text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }
                >
                  등록 시간
                </button>
                <button
                  onClick={() => setFilter('views')}
                  className={
                    filter === 'views'
                      ? 'font-bold text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }
                >
                  조회수
                </button>
                <button
                  onClick={() => setFilter('likes')}
                  className={
                    filter === 'likes'
                      ? 'font-bold text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }
                >
                  좋아요
                </button>
                <button className="cursor-not-allowed text-zinc-500">
                  즐겨찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
