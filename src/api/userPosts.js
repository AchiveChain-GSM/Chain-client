// src/api/userPosts.js
import api from './axios';

const FILTER_TO_ENDPOINT = {
  recent: '/api/posts/written/recent',
  likes: '/api/posts/written/likes',
  views: '/api/posts/written/views',
  default: '/api/posts/written',
};

export async function getMyWrittenPosts(filter = 'recent', params = {}) {
  const endpoint = FILTER_TO_ENDPOINT[filter] ?? FILTER_TO_ENDPOINT.default;
  const res = await api.get(endpoint, { params: params || {} });
  return res.data;
}
