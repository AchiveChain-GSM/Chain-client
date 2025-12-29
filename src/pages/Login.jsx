import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setTokens } from '../api/axios';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import checkIcon from '../assets/icon/check.svg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isError, setIsError] = useState(false);

  const decodeJwtPayload = (token) => {
    try {
      if (!token) return null;
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  const getEmailFromToken = (accessToken) => {
    const payload = decodeJwtPayload(accessToken);
    return payload?.sub || '';
  };

  const handleLogin = async () => {
    try {
      setIsError(false);

      const response = await api.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data || {};

      if (!accessToken) {
        setIsError(true);
        return;
      }

      // ✅ 토큰 저장 (기존 방식 유지)
      setTokens(
        { accessToken, refreshToken },
        { persist: isAutoLogin ? 'local' : 'session' },
      );

      // ✅ “현재 로그인 저장소”를 자동로그인 여부로 결정
      const store = isAutoLogin ? localStorage : sessionStorage;

      const tokenEmail = getEmailFromToken(accessToken);
      if (tokenEmail) {
        // ✅ 공용키는 최소화: email 정도만 저장(선택)
        store.setItem('email', tokenEmail);

        // ✅ 프로필 캐시가 이미 있으면 현재 로그인 저장소에도 복사
        const cached =
          localStorage.getItem(`profile:${tokenEmail}`) ||
          sessionStorage.getItem(`profile:${tokenEmail}`);

        if (cached) {
          store.setItem(`profile:${tokenEmail}`, cached);
        }
        // 캐시가 없으면 그냥 둡니다.
        // TopBar는 email만으로도 fallback 표시가 됩니다.
      }

      navigate('/');
    } catch (e) {
      setIsError(true);
    }
  };

  return (
    <div
      className="font-pretendard flex flex-col items-center justify-center"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#191919',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: '138px', height: '220px', marginBottom: '80px' }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div
        style={{
          width: '559px',
          backgroundColor: '#1D1D1D',
          padding: '24px 24px 32px 24px',
          boxShadow: '0px 10px 64px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsError(false);
            }}
            style={{
              width: '511px',
              height: '48px',
              backgroundColor: '#191919',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 16px',
              color: email ? '#FFFFFF' : '#444444',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none',
              marginBottom: '12px',
            }}
          />

          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsError(false);
            }}
            style={{
              width: '511px',
              height: '48px',
              backgroundColor: '#191919',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 16px',
              color: password ? '#FFFFFF' : '#444444',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none',
              marginBottom: '24px',
            }}
          />
        </div>

        <div
          className="flex items-center justify-between"
          style={{ marginBottom: '64px' }}
        >
          <div
            className="flex cursor-pointer items-center gap-[8px]"
            onClick={() => setIsAutoLogin(!isAutoLogin)}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#191919',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
              }}
            >
              {isAutoLogin && (
                <img
                  src={checkIcon}
                  alt="Checked"
                  style={{ width: '12px', height: '9px' }}
                />
              )}
            </div>
            <span style={{ color: '#444444', fontSize: '14px' }}>
              자동 로그인
            </span>
          </div>

          {isError && (
            <span style={{ color: '#FF5050', fontSize: '12px' }}>
              이메일 또는 비밀번호가 일치하지 않습니다
            </span>
          )}
        </div>

        <button
          onClick={handleLogin}
          style={{
            width: '511px',
            height: '48px',
            backgroundColor: '#FFFFFF',
            color: '#111111',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          로그인
        </button>

        <div
          className="flex justify-center gap-[12px]"
          style={{ color: '#888888', fontSize: '12px' }}
        >
          
          <span className="cursor-pointer" onClick={() => navigate('/signup')}>
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
