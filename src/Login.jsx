import React, { useState } from 'react';
import logo from './assets/logo/logo-vertical-symbol.svg';
import checkIcon from './assets/icon/check.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLogin = () => {
    setIsError(true);
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
        style={{
          width: '138px',
          height: '220px',
          marginBottom: '80px',
        }}
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
          <span className="cursor-pointer">비밀번호 찾기</span>
          <span style={{ color: '#2F3233' }}>|</span>
          <span className="cursor-pointer">회원가입</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
