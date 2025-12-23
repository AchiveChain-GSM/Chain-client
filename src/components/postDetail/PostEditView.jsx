// src/components/postDetail/PostEditView.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost } from '../../api/posts'; // API 함수
import WriteEditor from '../upload/writeEditor'; // 기존 에디터 재사용

export default function PostEditView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        // id가 "id-001" 형태일 경우 숫자만 추출 (백엔드 로직에 따라 다름)
        const rawId = String(id).replace(/\D/g, ''); 
        const res = await getPost(rawId);
        
        // 백엔드 응답 데이터를 에디터가 이해할 수 있는 구조로 변환
        const data = res.data;
        
        setPostData({
          postId: data.id || rawId,
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          // 기존 첨부파일이 있다면 여기서 변환 필요 (files 구조에 맞게)
          files: (data.files || []).map(f => ({
            id: f.fileId || f.id,
            name: f.originalName || f.name,
            url: f.url, // 기존 파일은 URL이 있어야 미리보기 가능
            size: f.size,
            type: f.mimeType // 필요 시
          }))
        });
      } catch (error) {
        console.error('글 불러오기 실패:', error);
        alert('게시글 정보를 불러올 수 없습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-8 text-white">불러오는 중...</div>;
  }

  // 데이터가 준비되면 WriteEditor에 initialPost로 넘김
  return <WriteEditor initialPost={postData} />;
}