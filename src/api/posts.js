import api from './axios';

/* =========================
 * 게시글 조회
 * ========================= */

// 게시글 단건 조회
export async function getPost(postId) {
  const res = await api.get(`/api/posts/${postId}`);
  return res.data;
}

// 게시글 목록 조회 (필요 시)
export async function getPosts(params = {}) {
  const res = await api.get('/api/posts', { params });
  return res.data;
}

/* =========================
 * 게시글 생성 (Create)
 * ========================= */
export async function createPost({ title, content, tags = [], images = [] }) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('content', content);

  tags.forEach((tag) => {
    formData.append('tags', tag);
  });

  images.forEach((file) => {
    formData.append('images', file);
  });

  const res = await api.post('/api/posts/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

/* =========================
 * 게시글 수정 (Update) - ✅ 추가된 부분
 * ========================= */
export async function updatePost(
  postId,
  { title, content, tags = [], images = [], removeImage_ids = [] }
) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);

  tags.forEach((tag) => formData.append('tags', tag));
  
  // 새로 추가된 파일
  images.forEach((file) => formData.append('images', file));

  // 삭제된 기존 파일 ID
  removeImage_ids.forEach((id) => formData.append('removeImage_ids', id));

  // 백엔드 API 주소 확인 (/api/posts/update/{id})
  const res = await api.put(`/api/posts/update/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

/* =========================
 * 댓글
 * ========================= */

export async function getPostComments(postId) {
  const res = await api.get(`/api/posts/${postId}/comments`);
  return res.data;
}

export async function createPostComment(postId, content) {
  await api.post(`/api/posts/${postId}/comments`, { content });
}


// 신고 API (필요 시 주석 해제하여 사용)
/*
export async function reportPost(postId, payload) {
  await api.post(`/api/posts/report/${postId}`, payload);
}
*/

export async function deletePost(postId) {
  // 백엔드 스펙: /api/posts/delete/{post_id}
  const res = await api.delete(`/api/posts/delete/${postId}`);
  return res; // 200 OK면 성공
}
