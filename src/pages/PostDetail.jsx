import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
// ✅ 친구가 만든 뷰 컴포넌트를 가져오기만 합니다.
import PostDetailView from '../components/postDetail/PostDetailView';

export default function PostDetail() {
  const { postId } = useParams(); // 주소창에서 ID 추출
  const location = useLocation();

  // 1. 목록에서 넘겨받은 데이터가 있다면 먼저 사용 (화면 깜빡임 방지)
  const [postData, setPostData] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!postData);

  // 2. 서버에서 최신 상세 데이터를 가져옴
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // ✅ 명세서 API 호출
        const response = await axios.get(`/api/posts/${postId}`);
        // 서버에서 받은 데이터를 상태에 저장
        setPostData(response.data);
      } catch (err) {
        console.error('서버에서 상세 데이터를 가져오는 데 실패했습니다:', err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchDetail();
  }, [postId]);

  return (
    <Layout>
      <main className="flex h-full flex-1">
        <section className="flex-1">
          {/* 3. 로딩이 끝났거나 데이터가 있으면 친구가 만든 View에 데이터를 던져줍니다.
            친구 코드의 initialPost={postData} 이 부분으로 데이터가 흘러들어갑니다.
          */}
          {postData ? (
            <PostDetailView initialPost={postData} />
          ) : (
            loading && <div className="p-10 text-white">로딩 중...</div>
          )}
        </section>
      </main>
    </Layout>
  );
}
