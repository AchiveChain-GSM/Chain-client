/* =========================
 * 신고
 * ========================= */

// src/api/posts.js 파일 수정
// src/api/posts.js 수정
export async function reportPost(postId, payload) {
  // payload: { title, description }
  const res = await api.post(`/api/posts/report/${postId}`, payload);
  return res.data;
}
