

import { getAccessToken } from './axios';

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

function isExpired(payload) {
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

// ✅ 수정 완료: axios.js의 getAccessToken을 사용하여 로직을 하나로 합쳤어!
export function getCurrentUser() {
  const token = getAccessToken();

  if (!token) {
    return { userId: null, email: null, name: '', isAuthenticated: false };
  }

  const payload = decodeJwt(token);
  if (!payload || isExpired(payload)) {
    return { userId: null, email: null, name: '', isAuthenticated: false };
  }

  const email = payload.sub ?? null;
  const name =
    payload.name ??
    localStorage.getItem('userName') ??
    sessionStorage.getItem('userName') ??
    '';
  const userId = payload.userId ?? payload.id ?? null;

  return {
    userId,
    email,
    name,
    isAuthenticated: true,
  };
}