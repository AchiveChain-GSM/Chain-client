import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TEMP_SERVER_URL = 'http://localhost:8080'; // 서버의 기본 주소 (나중에 실제 서버 도메인으로 변경하세요)
const API_BASE_URL = `${TEMP_SERVER_URL}/api/auth`; // 인증 관련 API 공통 경로
const EMAIL_DOMAIN = '@gsm.hs.kr';

const STYLES = {
  baseText: {
    fontFamily: 'Pretendard, sans-serif',
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
  },
  commonInput: {
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
};

const Findps = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailAuth = async () => {
    if (!email.endsWith(EMAIL_DOMAIN)) {
      setErrorMessage(
        `${EMAIL_DOMAIN} 도메인을 사용하는 계정으로 이메일을 인증해주세요`,
      );
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/send-email`, { email });
      setErrorMessage('');
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '인증번호 발송에 실패했습니다.',
      );
    }
  };

  const handleVerifyNext = async () => {
    try {
      await axios.post(`${API_BASE_URL}/verify-email`, {
        email: email,
        code: authCode,
      });
      setErrorMessage('');
      setStep(2);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '인증번호가 일치하지 않습니다.',
      );
    }
  };

  const validatePassword = (pw) => {
    const hasLetter = /[a-z]/i.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const isLongEnough = pw.length >= 8;
    return hasLetter && hasNumber && isLongEnough;
  };

  const handleResetComplete = async () => {
    if (!validatePassword(password)) {
      setErrorMessage(
        '영문과 숫자를 포함하여 8자리 이상으로 비밀번호를 만들어주세요',
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/change-password`, {
        email,
        password
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.',
      );
    }
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center"
      style={{ backgroundColor: '#191919', paddingTop: '15vh' }}
    >
      <div
        style={{
          marginBottom: '48px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ ...STYLES.baseText, fontSize: '32px' }}>
          {step === 1 ? '비밀번호 찾기' : '비밀번호 재설정'}
        </h1>
      </div>

      <div className="flex w-full flex-col items-center">
        {step === 1 && (
          <div
            style={{
              width: '559px',
              height: '308px',
              backgroundColor: '#1D1D1D',
              borderRadius: '12px',
              padding: '24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '12px',
                width: '511px',
                marginBottom: '12px',
              }}
            >
              <input
                type="text"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...STYLES.commonInput, width: '393px' }}
              />
              <button
                onClick={handleEmailAuth}
                style={{
                  width: '106px',
                  height: '48px',
                  backgroundColor: '#E2E2E2',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Pretendard',
                }}
              >
                이메일 인증
              </button>
            </div>
            <input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              style={{ ...STYLES.commonInput, width: '511px' }}
            />
            <div
              style={{
                width: '511px',
                height: '20px',
                marginTop: '10px',
                textAlign: 'right',
              }}
            >
              {errorMessage && (
                <span
                  style={{
                    color: '#FF5050',
                    fontSize: '14px',
                    fontFamily: 'Pretendard',
                  }}
                >
                  {errorMessage}
                </span>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                width: '511px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <button
                onClick={handleVerifyNext}
                disabled={authCode.length === 0}
                style={{
                  width: '511px',
                  height: '48px',
                  borderRadius: '8px',
                  cursor: authCode.length > 0 ? 'pointer' : 'not-allowed',
                  backgroundColor: authCode.length > 0 ? '#E2E2E2' : '#4E4E4E',
                  color: authCode.length > 0 ? '#000000' : '#888888',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                }}
              >
                다음
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Pretendard',
                }}
              >
                이전으로
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div
            style={{
              width: '559px',
              height: '308px',
              backgroundColor: '#1D1D1D',
              borderRadius: '12px',
              padding: '24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '511px',
              }}
            >
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                style={{ ...STYLES.commonInput, width: '511px' }}
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
                style={{ ...STYLES.commonInput, width: '511px' }}
              />
            </div>
            <div
              style={{
                width: '511px',
                height: '40px',
                marginTop: '10px',
                textAlign: 'right',
              }}
            >
              {errorMessage && (
                <span
                  style={{
                    color: '#FF5050',
                    fontSize: '14px',
                    fontFamily: 'Pretendard',
                    display: 'block',
                  }}
                >
                  {errorMessage}
                </span>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                width: '511px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <button
                onClick={handleResetComplete}
                disabled={!password || !confirmPassword}
                style={{
                  width: '511px',
                  height: '48px',
                  borderRadius: '8px',
                  cursor:
                    password && confirmPassword ? 'pointer' : 'not-allowed',
                  backgroundColor:
                    password && confirmPassword ? '#E2E2E2' : '#4E4E4E',
                  color: password && confirmPassword ? '#000000' : '#888888',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                }}
              >
                비밀번호 재설정 완료
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setErrorMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFF',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Pretendard',
                }}
              >
                이전으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Findps;
