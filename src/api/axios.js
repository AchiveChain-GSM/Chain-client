// src/api/axios.js
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://port-0-chain-server-mjgfqy3sbea3654a.sel3.cloudtype.app';

const DEBUG_API = true; // 로그 on/off
const AUTH_REDIRECT_ON_401 = true;

/** ---------------------------------------
 * Token helpers
 * -------------------------------------- */
function normalizeToken(raw) {
  if (!raw) return null;
  let t = String(raw).trim();
  t = t.replace(/^Bearer\s+/i, '').trim();
  return t || null;
}

// 토큰 정리(개행/공백 제거)
function sanitizeToken(token) {
  if (!token) return null;
  return String(token).replace(/\s+/g, '');
}

export function getAccessToken() {
  const fromLocal = localStorage.getItem('accessToken');
  const fromSession = sessionStorage.getItem('accessToken');
  return normalizeToken(fromLocal || fromSession);
}

export function getRefreshToken() {
  const fromLocal = localStorage.getItem('refreshToken');
  const fromSession = sessionStorage.getItem('refreshToken');
  return normalizeToken(fromLocal || fromSession);
}

export function setTokens(
  { accessToken, refreshToken },
  { persist = 'session' } = {},
) {
  const storage = persist === 'local' ? localStorage : sessionStorage;
  const otherStorage = persist === 'local' ? sessionStorage : localStorage;

  otherStorage.removeItem('accessToken');
  otherStorage.removeItem('refreshToken');

  if (accessToken) storage.setItem('accessToken', normalizeToken(accessToken));
  if (refreshToken)
    storage.setItem('refreshToken', normalizeToken(refreshToken));

  syncAuthHeader();
}

export function clearTokens() {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  syncAuthHeader();
}

/** ---------------------------------------
 * axios instance
 * -------------------------------------- */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// 앱 시작/토큰 저장 직후 axios 기본 Authorization 헤더를 동기화
export function syncAuthHeader() {
  const token = sanitizeToken(getAccessToken());
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** ---------------------------------------
 * JWT decode (디버그용)
 * -------------------------------------- */
function base64UrlDecode(str) {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    return null;
  }
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = base64UrlDecode(payload);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

function logTokenSummary(token) {
  if (!DEBUG_API) return;
  const payload = decodeJwt(token);
  if (!payload) return;
  const exp = payload.exp ? new Date(payload.exp * 1000).toISOString() : null;
  const roles = payload.roles || payload.authorities || null;
  console.log('[TOKEN]', { sub: payload.sub, exp, roles });
}

/** ---------------------------------------
 * Public 요청 판별
 * -------------------------------------- */
function getPath(config) {
  const raw = String(config?.url || '');
  try {
    // raw가 절대주소면 pathname만 추출
    if (raw.startsWith('http')) return new URL(raw).pathname;
  } catch (_) {}
  // 상대주소면 그대로
  return raw;
}

function isPublicRequest(config) {
  const url = getPath(config);
  const method = String(config?.method || 'get').toLowerCase();

  if (/^\/?api\/auth\b/.test(url) || /^\/?api\/health\b/.test(url)) return true;
  if (method !== 'get') return false;

  const PUBLIC_GET = [
    /^\/?api\/posts\/popular\b/,
    /^\/?api\/posts\/most-view\b/,
    /^\/?api\/posts\/search\b/,
    // ✅ 단건 공개를 진짜로 public로 둘 거면 주석 해제
    // /^\/?api\/posts\/\d+\b/,
  ];

  return PUBLIC_GET.some((re) => re.test(url));
}


/** ---------------------------------------
 * Request interceptor
 * -------------------------------------- */
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};

    // ✅ FormData(multipart)면 Content-Type을 강제로 제거
    // (브라우저가 boundary 포함하여 자동으로 설정해야 정상)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }

    // ✅ public 요청이면 Authorization 헤더 제거(기본헤더에 잡혀있어도 강제 제거)
    if (isPublicRequest(config)) {
      if (config.headers?.Authorization) delete config.headers.Authorization;
      if (config.headers?.authorization) delete config.headers.authorization;
      // axios가 merge 하면서 defaults.Authorization이 남는 경우가 있어서 한 번 더 방어
      config.headers = { ...(config.headers || {}) };
    } else {
      const token = sanitizeToken(getAccessToken());
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        };
        if (DEBUG_API) logTokenSummary(token);
      } else {
        if (config.headers?.Authorization) delete config.headers.Authorization;
      }
    }

    if (DEBUG_API) {
      const method = (config?.method || 'GET').toUpperCase();
      const fullUrl = `${config?.baseURL || ''}${config?.url || ''}`;
      console.log('[REQ]', method, fullUrl, 'params=', config?.params);

      // FormData는 그대로 찍으면 쓸모없어서 제외
      if (config?.data && !(config.data instanceof FormData)) {
        console.log('[REQ_DATA]', config.data);
      } else if (config?.data instanceof FormData) {
        console.log('[REQ_DATA]', '[FormData]');
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);
/** ---------------------------------------
 * Response interceptor (401 처리)
 * -------------------------------------- */
api.interceptors.response.use(
  (res) => {
    if (DEBUG_API) console.log('[RES]', res.status, res.config?.url, res.data);
    return res;
  },
  (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    const url = String(originalRequest?.url || '');

    if (DEBUG_API) {
      console.warn('[ERR]', status, url, error?.response?.data);
      console.log('[ERR_META]', {
        hasToken: !!getAccessToken(),
        hasAuthHeader: !!originalRequest?.headers?.Authorization,
      });
    }

    if (originalRequest?._skipAuthRedirect) {
      return Promise.reject(error);
    }

    // ✅ public 요청에서 난 401은 로그인 리다이렉트/토큰삭제 대상이 아님
    // (특히 GET /api/posts/** 는 permitAll 이지만, Authorization이 붙으면
    //  만료 토큰 때문에 JwtAuthFilter가 401을 낼 수 있어 방어적으로 제외)
    const isPublic = isPublicRequest(originalRequest);

    if (status === 401 && AUTH_REDIRECT_ON_401 && !isPublic) {
      // ✅ auth 처리 과정은 제외
      const isAuthProcess =
        url.includes('/api/auth/verify-email') ||
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/find-password');

      // ✅ 토큰은 무조건 정리 (만료/무효 토큰 루프 방지)
      if (!isAuthProcess) clearTokens();

      // ✅ 로그인 페이지가 아니면 로그인으로
      if (!isAuthProcess && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
