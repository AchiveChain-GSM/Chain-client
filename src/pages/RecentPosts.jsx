import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import api from '../api/axios';

const FILTERS = {
  DEFAULT: 'default', // /viewed
  RECENT: 'recent',   // /viewed/recent
  LIKES: 'likes',     // /viewed/likes
  VIEWS: 'views',     // /viewed/views
};

export default function RecentPosts() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState(FILTERS.DEFAULT);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViewedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ 백엔드 엔드포인트 매핑
        const endpoint =
          filter === FILTERS.RECENT
            ? '/api/posts/viewed/recent'
            : filter === FILTERS.LIKES
              ? '/api/posts/viewed/likes'
              : filter === FILTERS.VIEWS
                ? '/api/posts/viewed/views'
                : '/api/posts/viewed';

        const res = await api.get(endpoint);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.content || [];

        setPosts(data);
      } catch (err) {
        console.error('최근 본 자료 로딩 실패:', err);
        setError('최근 본 자료를 불러오는 중 오류가 발생했습니다.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchViewedPosts();
  }, [filter]);

  const filteredPosts = posts.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* ===== 메인 영역 ===== */}
        <div className="flex-1 overflow-hidden rounded-lg bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold text-white">최근 본 자료</h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36px]">
              {loading ? (
                <div className="mt-[60px] text-center text-zinc-500">
                  데이터를 불러오는 중입니다...
                </div>
              ) : error ? (
                <div className="mt-[60px] text-center text-red-500">
                  {error}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="mt-[60px] text-center text-zinc-600">
                  최근 본 자료가 없습니다
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {filteredPosts.map((item) => (
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

            <div className="h-[100px]" />
          </div>
        </div>

        {/* ===== 사이드 정렬 버튼 ===== */}
        <aside className="w-[180px] shrink-0">
          <div className="rounded-xl bg-[#1D1D1D] p-[20px] text-white">
            <div className="mb-[16px] text-[16px] font-semibold">정렬</div>

            <div className="flex flex-col gap-[12px] text-[14px]">
              <button
                onClick={() => setFilter(FILTERS.DEFAULT)}
                className={`text-left ${
                  filter === FILTERS.DEFAULT
                    ? 'font-semibold text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                기본
              </button>

              <button
                onClick={() => setFilter(FILTERS.RECENT)}
                className={`text-left ${
                  filter === FILTERS.RECENT
                    ? 'font-semibold text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                최신순
              </button>

              <button
                onClick={() => setFilter(FILTERS.LIKES)}
                className={`text-left ${
                  filter === FILTERS.LIKES
                    ? 'font-semibold text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                좋아요순
              </button>

              <button
                onClick={() => setFilter(FILTERS.VIEWS)}
                className={`text-left ${
                  filter === FILTERS.VIEWS
                    ? 'font-semibold text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                조회수순
              </button>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
