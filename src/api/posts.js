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
    // ✅ ; 도 태그 구분자로 인정
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

// ✅ 단건 조회 (로그인 필요)
export async function getPostPublic(postId) {
  const res = await api.get(`/api/posts/${postId}`);
  return res.data;
}

// ✅ 목록 조회
const LIST_ENDPOINTS = {
  recent: '/api/posts/recent',
  popular: '/api/posts/popular', // 보통 likes desc
  likes: '/api/posts/popular', // ✅ 호환
  'most-view': '/api/posts/most-view',
  views: '/api/posts/most-view', // ✅ 호환
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

  // 호환키 정리
  if (sortKey === 'likes') sortKey = 'popular';
  if (sortKey === 'views') sortKey = 'most-view';

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

// ✅ 타임라인(기간) 게시물 조회
export async function getTimelinePosts({
  from,
  to,
  page = 0,
  size = 2000,
} = {}) {
  const res = await api.post('/api/posts/timeline', { from, to, page, size });
  return res.data;
}

/* =========================
 * 조회한 글 목록 (최근 본 자료)
 * ========================= */

const VIEWED_ENDPOINTS = {
  recent: '/api/posts/viewed/recent',
  likes: '/api/posts/viewed/likes',
  views: '/api/posts/viewed/views',

  // ✅ 호환 (FilterModal이 popular/most-view 주는 경우 대비)
  popular: '/api/posts/viewed/likes',
  'most-view': '/api/posts/viewed/views',
};

export async function getViewedPosts(sortOrParams = 'recent', maybeParams = {}) {
  let sortKey = 'recent';
  let params = {};

  if (typeof sortOrParams === 'string') {
    sortKey = sortOrParams;
    params = maybeParams && typeof maybeParams === 'object' ? maybeParams : {};
  } else if (sortOrParams && typeof sortOrParams === 'object') {
    sortKey = 'recent';
    params = sortOrParams;
  }

  // ✅ 정규화
  if (sortKey === 'popular') sortKey = 'likes';
  if (sortKey === 'most-view') sortKey = 'views';

  const url = VIEWED_ENDPOINTS[sortKey] || VIEWED_ENDPOINTS.recent;
  const res = await api.get(url, { params: params || {} });
  return res.data;
}

/* =========================
 * 좋아요/북마크 목록
 * ========================= */

export async function getLikedPosts(sort = 'recent', params = {}) {
  const safeParams =
    params && typeof params === 'object' && !Array.isArray(params)
      ? { ...params }
      : {};

  // ✅ sort 키 호환
  if (sort === 'popular') sort = 'likes';
  if (sort === 'most-view') sort = 'views';

  // 서버가 sort 쿼리파라미터를 지원하는 경우에만 유효
  if (sort === 'likes') safeParams.sort = safeParams.sort ?? 'likes,desc';
  else if (sort === 'views') safeParams.sort = safeParams.sort ?? 'views,desc';
  else safeParams.sort = safeParams.sort ?? 'createdAt,desc';

  const res = await api.get('/api/posts/liked', { params: safeParams });
  return res.data;
}

export async function getBookmarkedPosts(sort = 'recent', params = {}) {
  const safeParams =
    params && typeof params === 'object' && !Array.isArray(params)
      ? { ...params }
      : {};

  if (sort === 'popular') sort = 'likes';
  if (sort === 'most-view') sort = 'views';

  if (sort === 'likes') {
    safeParams.sort = safeParams.sort ?? 'likes,desc';
  } else if (sort === 'views') {
    safeParams.sort = safeParams.sort ?? 'views,desc';
  } else {
    // ✅ recent: 백에서 어떤 필드가 있는지 확정 전까지 sort를 보내지 않음
    delete safeParams.sort;
  }

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

  const safeTags = normalizeTagsForRequest(tags);
  safeTags.forEach((tag) => formData.append('tags', tag));

  images.forEach((file) => formData.append('images', file));
  files.forEach((file) => formData.append('files', file));

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

  const safeTags = normalizeTagsForRequest(tags);
  safeTags.forEach((tag) => formData.append('tags', tag));

  images.forEach((file) => formData.append('images', file));
  files.forEach((file) => formData.append('files', file));
  removeImage_ids.forEach((id) => formData.append('removeImage_ids', id));

  const res = await api.post('/api/posts/update', formData);
  return res.data;
}

export async function deletePost(postId) {
  const res = await api.delete(`/api/posts/delete/${postId}`);
  return res.data;
}

/* =========================
 * 댓글
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
