// src/utils/auth.js
export function getAccessToken() {
  return (
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    ''
  );
}

export function getMyProfileFromToken() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
    );

    return {
      email: payload.sub,
      userName: payload.userName,
      generation: payload.generation,
      userClass: payload.userClass,
      userNumber: payload.userNumber,
    };
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('accessToken');
  sessionStorage.removeItem('accessToken');
}
