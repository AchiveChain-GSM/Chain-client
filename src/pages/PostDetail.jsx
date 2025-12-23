import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
// ✅ 친구가 만든 뷰 컴포넌트
import PostDetailView from '../components/postDetail/PostDetailView';

export default function PostDetail() {
  const { postId } = useParams(); // 주소창에서 ID 추출
  const location = useLocation();

  // 1. 목록에서 넘겨받은 데이터가 있다면 먼저 사용 (화면 깜빡임 방지)
  const [postData, setPostData] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!postData);
  // ✅ 코드 리뷰 반영: 에러 상태 추가
  const [error, setError] = useState(null);

  // 2. 서버에서 최신 상세 데이터를 가져옴
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null); // 새로운 요청 시작 시 에러 초기화

        // ✅ 명세서 API 호출
        const response = await axios.get(`/api/posts/${postId}`);

        // 서버에서 받은 데이터를 상태에 저장
        setPostData(response.data);
      } catch (err) {
        console.error('서버에서 상세 데이터를 가져오는 데 실패했습니다:', err);
        // ✅ 코드 리뷰 반영: 사용자에게 보여줄 에러 메시지 설정
        setError(
          '해당 자료를 불러올 수 없습니다. 삭제된 게시글이거나 네트워크 문제일 수 있습니다.',
        );
      } finally {
        setLoading(false);
      }
    };

    // 서버 데이터를 새로 받아와야 하는 경우(혹은 최신화가 필요한 경우) 호출
    if (postId) fetchDetail();
  }, [postId]);

  return (
    <Layout>
      <main className="flex h-full flex-1">
        <section className="flex-1">
          {/* ✅ 코드 리뷰 반영: 에러 발생 시 UI 처리 */}
          {error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-[20px] text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : postData ? (
            /* 3. 데이터가 있으면 친구가 만든 View에 전달 */
            <PostDetailView initialPost={postData} />
          ) : (
            /* 데이터도 없고 에러도 없는 '로딩' 상태일 때만 표시 */
            loading && (
              <div className="flex h-full items-center justify-center p-10 text-white">
                로딩 중...
              </div>
            )
          )}
        </section>
      </main>
    </Layout>
  );
}
