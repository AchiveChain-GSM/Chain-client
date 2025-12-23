import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import SearchInput from '../components/Search/SearchInput';
import axios from 'axios';

const FILTERS = {
  DEFAULT: 'default',
  RECENT: 'recent',
  LIKES: 'likes',
  VIEWS: 'views',
};

export default function RecentPosts() {
  const navigate = useNavigate(); // ✅ 추가
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(FILTERS.DEFAULT);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('로그인이 필요한 서비스입니다.');
      setLoading(false);
      return;
    }

    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseEndpoint = `/api/posts/viewed/${userId}`;
        const endpoint =
          filter !== FILTERS.DEFAULT
            ? `${baseEndpoint}/${filter}`
            : baseEndpoint;
        const response = await axios.get(endpoint);
        setPosts(response.data.content || []);
      } catch (err) {
        setError('최근 본 자료를 불러오는 중 에러가 발생했습니다.');
        console.error('로딩 에러:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, [filter, userId]);

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  const filterOptions = [
    { id: FILTERS.RECENT, label: '최신순' },
    { id: FILTERS.VIEWS, label: '조회수순' },
    { id: FILTERS.LIKES, label: '좋아요순' },
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
                <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {(keyword ? searchResults : posts).map((item) => (
                    <TimelineCard
                      key={item.postId}
                      item={item}
                      // ✅ 클릭 기능 추가
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
        </div>
        <div className="w-[200px] shrink-0 pt-[48px]">
          <div className="flex flex-col gap-6 rounded-xl bg-[#1D1D1D] p-[24px]">
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
    </Layout>
  );
}
