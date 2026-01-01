// src/api/reactions.js
import api from './axios';

/** 좋아요 토글
 * POST /api/posts/{postId}/likes
 * Response: 200 OK
 */
export async function togglePostLike(postId) {
  const res = await api.post(`/api/posts/${postId}/likes`);
  return res.data;
}

/** 북마크 토글
 * POST /api/posts/{postId}/bookmark
 * Response: 200 OK
 */
export async function togglePostBookmark(postId) {
  const res = await api.post(`/api/posts/${postId}/bookmark`);
  return res.data;
}
