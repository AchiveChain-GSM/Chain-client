// src/api/posts.js
import api from './axios';
import publicApi from './publicAxios';

/* =========================
 * 유틸
 * ========================= */

function pickList(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.content))
    return data.content;
  return [];
}

function normalizeTagsForRequest(tags) {
  const arr = Array.isArray(tags) ? tags : [tags];

  const flat = arr
    .flatMap((x) => {
      if (x == null) return [];
      if (typeof x === 'string') return [x];
      return [x?.name ?? x?.tagName ?? x?.value ?? ''];
    })
    // ✅ 여기만 변경: ; 도 태그 구분자로 인정
    .flatMap((v) => String(v).split(/[;,|\s]+/g))
    .map((v) => v.trim())
    .map((v) => v.replace(/^#+/, ''))
    .filter(Boolean);

  const seen = new Set();
  const uniq = [];
  for (const t of flat) {
    if (seen.has(t)) continue;
    seen.add(t);
    uniq.push(t);
  }
  return uniq;
}


/* =========================
 * 게시글 조회
 * ========================= */

// ✅ 단건 조회
export async function getPostPublic(postId) {
  console.log('[getPostPublic] using api instance');
  console.log(
    '[tokens]',
    localStorage.getItem('accessToken'),
    sessionStorage.getItem('accessToken'),
  );

  const res = await api.get(`/api/posts/${postId}`);
  return res.data;
}

// ✅ 목록 조회
const LIST_ENDPOINTS = {
  recent: '/api/posts/recent',
  popular: '/api/posts/popular',
  'most-view': '/api/posts/most-view',
  views: '/api/posts/most-view',
};

export async function getPosts(sortOrParams = 'recent', maybeParams = {}) {
  let sortKey = 'recent';
  let params = {};

  if (typeof sortOrParams === 'string') {
    sortKey = sortOrParams;
    params = maybeParams && typeof maybeParams === 'object' ? maybeParams : {};
  } else if (sortOrParams && typeof sortOrParams === 'object') {
    params = sortOrParams;
  }

  const url = LIST_ENDPOINTS[sortKey] || LIST_ENDPOINTS.recent;
  const res = await api.get(url, { params: params || {} });
  return res.data;
}

// ✅ 검색
export async function searchPosts(keyword, params = {}) {
  const res = await api.get('/api/posts/search', {
    params: { keyword, ...(params || {}) },
  });
  return res.data;
}

export async function getTimelinePosts({
  from,
  to,
  page = 0,
  size = 2000,
} = {}) {
  const res = await api.post('/api/posts/timeline', { from, to, page, size });
  return res.data;
}

const VIEWED_ENDPOINTS = {
  recent: '/api/posts/viewed/recent',
  likes: '/api/posts/viewed/likes',
  views: '/api/posts/viewed/views',
};

// ✅ 조회한 글 목록
export async function getViewedPosts(
  sortOrParams = 'recent',
  maybeParams = {},
) {
  let sortKey = 'recent';
  let params = {};

  if (typeof sortOrParams === 'string') {
    sortKey = sortOrParams;
    params = maybeParams && typeof maybeParams === 'object' ? maybeParams : {};
  } else if (sortOrParams && typeof sortOrParams === 'object') {
    sortKey = 'recent';
    params = sortOrParams;
  }

  const url = VIEWED_ENDPOINTS[sortKey] || VIEWED_ENDPOINTS.recent;
  const res = await api.get(url, { params: params || {} });
  return res.data;
}

export async function getLikedPosts(sort = 'recent', params = {}) {
  const safeParams =
    params && typeof params === 'object' && !Array.isArray(params)
      ? { ...params }
      : {};

  if (sort === 'popular') safeParams.sort = safeParams.sort ?? 'likes,desc';
  else if (sort === 'most-view' || sort === 'views')
    safeParams.sort = safeParams.sort ?? 'views,desc';

  const res = await api.get('/api/posts/liked', { params: safeParams });
  return res.data;
}

export async function getBookmarkedPosts(sort = 'recent', params = {}) {
  const safeParams =
    params && typeof params === 'object' && !Array.isArray(params)
      ? { ...params }
      : {};

  if (sort === 'popular') safeParams.sort = safeParams.sort ?? 'likes,desc';
  else if (sort === 'most-view' || sort === 'views')
    safeParams.sort = safeParams.sort ?? 'views,desc';

  const res = await api.get('/api/posts/bookmarked', { params: safeParams });
  return res.data;
}

/* =========================
 * 게시글 생성/수정/삭제
 * ========================= */

export async function createPost({
  title,
  content,
  tags = [],
  images = [],
  files = [],
}) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);

  // ✅ 핵심: tags를 하나씩 반복해서 append (표준 FormData 방식)
  // 예: tags=tag1 & tags=tag2 ...
  const safeTags = normalizeTagsForRequest(tags);
  safeTags.forEach((tag) => {
    formData.append('tags', tag);
  });

  images.forEach((file) => {
    formData.append('images', file);
  });

  files.forEach((file) => {
    formData.append('files', file);
  });

  // 복잡한 Fallback 없이 바로 전송
  const res = await api.post('/api/posts/create', formData);

  const location =
    res.data || res.headers?.location || res.headers?.Location || '';
  const m = String(location).match(/\/api\/posts\/(\d+)/);
  if (m?.[1]) return Number(m[1]);
  if (res.data?.postId) return Number(res.data.postId);

  throw new Error(`CREATE_POST_NO_ID: ${location}`);
}

export async function updatePost(
  postId,
  {
    title,
    content,
    tags = [],
    images = [],
    files = [],
    removeImage_ids = [],
  } = {},
) {
  const formData = new FormData();

  formData.append('post_id', postId);
  formData.append('title', title ?? '');
  formData.append('content', content ?? '');

  // ✅ 핵심: tags 반복 append
  const safeTags = normalizeTagsForRequest(tags);
  safeTags.forEach((tag) => {
    formData.append('tags', tag);
  });

  images.forEach((file) => {
    formData.append('images', file);
  });

  files.forEach((file) => {
    formData.append('files', file);
  });

  removeImage_ids.forEach((id) => {
    formData.append('removeImage_ids', id);
  });

  const res = await api.post('/api/posts/update', formData);
  return res.data;
}

export async function deletePost(postId) {
  const res = await api.delete(`/api/posts/delete/${postId}`);
  return res.data;
}

/* =========================
 * 설명
 * ========================= */

export async function getPostComments(postId) {
  const res = await api.get(`/api/posts/${postId}/comments`);
  return res.data;
}

export async function createPostComment(postId, payload) {
  const body =
    typeof payload === 'string'
      ? { content: payload }
      : payload && typeof payload === 'object'
        ? payload
        : null;

  const content = (body?.content ?? '').toString().trim();
  if (!content) throw new Error('EMPTY_CONTENT');

  const res = await api.post(`/api/posts/${postId}/comments`, { content });
  return res.data;
}

/* =========================
 * 신고
 * ========================= */

export async function reportPost(postId, payload) {
  const res = await api.post(`/api/posts/report/${postId}`, payload);
  return res.data;
}
