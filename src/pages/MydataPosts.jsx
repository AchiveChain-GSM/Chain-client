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

export default function MydataPosts() {
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

    const fetchMydata = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseEndpoint = `/api/posts/written/${userId}`;
        const endpoint =
          filter !== FILTERS.DEFAULT
            ? `${baseEndpoint}/${filter}`
            : baseEndpoint;
        const response = await axios.get(endpoint);
        setPosts(response.data.content || []);
      } catch (err) {
        setError('자료를 불러오는 중 에러가 발생했습니다.');
        console.error('내 자료 로딩 에러:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMydata();
  }, [filter, userId]);

  const searchResults = posts.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold text-white">내 자료</h2>
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
        {/* 사이드바 생략(위와 동일) */}
      </div>
    </Layout>
  );
}
