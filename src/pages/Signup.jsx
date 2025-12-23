import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_PATH = '/api/auth';
const EMAIL_DOMAIN = '@gsm.hs.kr';

const STYLES = {
  container: {
    backgroundColor: '#191919',
    paddingTop: '15vh',
  },
  card: {
    width: '559px',
    backgroundColor: '#1D1D1D',
    borderRadius: '12px',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  baseText: {
    fontFamily: 'Pretendard, sans-serif',
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
  },
  input: {
    height: '48px',
    backgroundColor: '#191919',
    border: 'none',
    borderRadius: '8px',
    padding: '0 16px',
    color: '#FFF',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'Pretendard',
    boxSizing: 'border-box',
  },
  primaryButton: {
    height: '48px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontFamily: 'Pretendard',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendEmail = async () => {
    if (!email.endsWith(EMAIL_DOMAIN)) {
      setErrorMessage(`${EMAIL_DOMAIN} 계정만 사용 가능합니다.`);
      return;
    }
    try {
      await axios.post(`${API_PATH}/send-email`, { email });
      setErrorMessage('');
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '이메일 전송 실패');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post(`${API_PATH}/verify-email`, { email, code: authCode });
      setIsEmailVerified(true);
      setErrorMessage('');
      alert('이메일 인증에 성공했습니다.');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '인증번호가 일치하지 않습니다.',
      );
    }
  };

  const handleSignup = async () => {
    if (!isEmailVerified) {
      setErrorMessage('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    try {
      await axios.post(`${API_PATH}/sign-up`, { email, password });
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '회원가입에 실패했습니다.',
      );
    }
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center"
      style={STYLES.container}
    >
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ ...STYLES.baseText, fontSize: '32px' }}>회원가입</h1>
      </div>

      <div style={STYLES.card}>
        <div className="flex w-full flex-col gap-[12px]">
          <div className="flex w-full gap-[12px]">
            <input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailVerified}
              style={{ ...STYLES.input, width: '393px' }}
            />
            <button
              onClick={handleSendEmail}
              disabled={isEmailVerified}
              style={{
                ...STYLES.primaryButton,
                width: '106px',
                backgroundColor: isEmailVerified ? '#4E4E4E' : '#E2E2E2',
                color: isEmailVerified ? '#888888' : '#000',
              }}
            >
              인증 요청
            </button>
          </div>

          {!isEmailVerified && (
            <div className="flex w-full gap-[12px]">
              <input
                type="text"
                placeholder="인증번호"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                style={{ ...STYLES.input, width: '393px' }}
              />
              <button
                onClick={handleVerifyEmail}
                style={{
                  ...STYLES.primaryButton,
                  width: '106px',
                  backgroundColor: '#E2E2E2',
                }}
              >
                인증 확인
              </button>
            </div>
          )}

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...STYLES.input, width: '511px' }}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ ...STYLES.input, width: '511px' }}
          />
        </div>

        <div
          style={{
            width: '511px',
            height: '20px',
            marginTop: '10px',
            textAlign: 'right',
          }}
        >
          {errorMessage && (
            <span style={{ color: '#FF5050', fontSize: '14px' }}>
              {errorMessage}
            </span>
          )}
        </div>

        <div className="mt-[32px] flex w-full flex-col items-center gap-[12px]">
          <button
            onClick={handleSignup}
            style={{
              ...STYLES.primaryButton,
              width: '511px',
              backgroundColor: isEmailVerified ? '#E2E2E2' : '#4E4E4E',
              color: isEmailVerified ? '#000' : '#888888',
            }}
          >
            회원가입 완료
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFF',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
