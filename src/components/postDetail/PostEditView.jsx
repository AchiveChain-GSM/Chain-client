// src/components/postDetail/PostEditView.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostPublic as getPost } from '../../api/posts';// API 함수
import WriteEditor from '../upload/writeEditor'; // 기존 에디터 재사용

export default function PostEditView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postData) return; // ✅ 이미 있으면 API 호출 안 함

    async function fetchPost() {
      try {
        const res = await getPost(id);
        setPostData(res);
      } catch (e) {
        alert('게시글 정보를 불러올 수 없습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, postData, navigate]);

  if (loading) {
    return <div className="p-8 text-white">불러오는 중...</div>;
  }

  return <WriteEditor initialPost={postData} />;
}
