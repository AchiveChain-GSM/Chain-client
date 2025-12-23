// src/api/reactions.js
import api from './axios';

export async function togglePostLike(postId) {
  return api.post(`/api/posts/${postId}/likes`);
}

export async function togglePostBookmark(postId) {
  return api.post(`/api/posts/${postId}/bookmark`);
}

/**
 * (선택) 일관된 이름이 필요하면 alias도 같이 제공 가능
 * export const toggleLike = togglePostLike;
 * export const toggleBookmark = togglePostBookmark;
 */
