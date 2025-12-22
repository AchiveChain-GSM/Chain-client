import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import checkIcon from '../assets/icon/check.svg';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userName, setUserName] = useState('');
  const [generation, setGeneration] = useState('');
  const [userClass, setUserClass] = useState('');
  const [userNumber, setUserNumber] = useState('');

  const baseTextStyle = {
    fontFamily: 'Pretendard, sans-serif',
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
  };

  const commonInputStyle = {
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
  };

  const handleEmailAuth = () => {
    if (email === 'test@gsm.hs.kr') {
      setErrorMessage('이미 계정이 등록된 이메일입니다');
      return;
    }
    if (!email.endsWith('@gsm.hs.kr')) {
      setErrorMessage(
        'gsm.hs.kr 도메인을 사용하는 계정으로 이메일을 인증해주세요',
      );
      return;
    }
    setErrorMessage('');
    alert('인증번호가 발송되었습니다. (테스트 번호: 1234)');
  };

  const handleStep2Next = () => {
    if (authCode === '1234') {
      setErrorMessage('');
      setStep(3);
    } else {
      setErrorMessage('인증번호가 일치하지 않습니다');
    }
  };

  const validatePassword = (pw) => {
    const hasLetter = /[a-z]/i.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const isLongEnough = pw.length >= 8;
    return hasLetter && hasNumber && isLongEnough;
  };

  const handleStep3Next = () => {
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
    setErrorMessage('');
    setStep(4);
  };

  const handleComplete = () => {
    navigate('/timeline');
  };

  const isStep4Valid =
    userName !== '' &&
    generation !== '' &&
    userClass !== '' &&
    userNumber !== '';

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
        <h1 style={{ ...baseTextStyle, fontSize: '32px' }}>회원가입</h1>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {step === 1 && (
          <div
            style={{
              width: '894px',
              height: '600px',
              backgroundColor: '#1D1D1D',
              borderRadius: '12px',
              padding: '32px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: '#191919',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'left',
                ...baseTextStyle,
                fontSize: '14px',
                lineHeight: '1.7',
                overflow: 'hidden',
              }}
            >
              [개인정보 수집 및 이용 동의]
              <br />
              <br />
              체인은 다음과 같이 개인정보를 수집 및 이용하고 있습니다.
              <br />
              <br />
              • - 수집 및 이용 목적: 회원 가입, 서비스 제공, 이용자 식별,
              부정이용 방지
              <br />
              • - 항목: 아이디, 닉네임, 비밀번호, 이메일주소
              <br />
              • - 수집 및 이용 목적: 본인확인, 이용자 식별, 부정이용 방지,
              중복가입 방지
              <br />
              • - 항목: 이름, 학년, 반, 번호
              <br />
              • - 보유 및 이용기간: 회원탈퇴일로부터 30일 (법령에 특별한 규정이
              있을 경우 관련 법령에 따라, 부정이용기록은 회원탈퇴일로부터 최대
              5년)
              <br />
              <br />
              동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 불가능
              합니다.
              <br />
              <br />※ 그 외의 사항 및 자동 수집 정보와 관련된 사항은
              개인정보처리방침을 따릅니다.
            </div>
            <div style={{ marginTop: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  ...baseTextStyle,
                  fontSize: '16px',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#191919',
                    border: agreed ? '2px solid #E2E2E2' : '1px solid #4E4E4E',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                    boxSizing: 'border-box',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {agreed && (
                    <img
                      src={checkIcon}
                      alt="check"
                      style={{
                        width: '14px',
                        height: '14px',
                        zIndex: 10,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
                <span>[개인정보 수집 및 이용 동의] (필수)</span>
              </label>
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => setStep(2)}
                  disabled={!agreed}
                  style={{
                    width: '830px',
                    height: '48px',
                    borderRadius: '8px',
                    cursor: agreed ? 'pointer' : 'not-allowed',
                    backgroundColor: agreed ? '#E2E2E2' : '#4E4E4E',
                    color: agreed ? '#000000' : '#888888',
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
                style={{ ...commonInputStyle, width: '393px' }}
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
              style={{ ...commonInputStyle, width: '511px' }}
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
                onClick={handleStep2Next}
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
                onClick={() => setStep(1)}
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

        {step === 3 && (
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
                style={{ ...commonInputStyle, width: '511px' }}
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage('');
                }}
                style={{ ...commonInputStyle, width: '511px' }}
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
                onClick={handleStep3Next}
                disabled={password === '' || confirmPassword === ''}
                style={{
                  width: '511px',
                  height: '48px',
                  borderRadius: '8px',
                  cursor:
                    password !== '' && confirmPassword !== ''
                      ? 'pointer'
                      : 'not-allowed',
                  backgroundColor:
                    password !== '' && confirmPassword !== ''
                      ? '#E2E2E2'
                      : '#4E4E4E',
                  color:
                    password !== '' && confirmPassword !== ''
                      ? '#000000'
                      : '#888888',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                }}
              >
                다음
              </button>
              <button
                onClick={() => {
                  setStep(2);
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

        {step === 4 && (
          <div
            style={{
              width: '559px',
              height: '268px',
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
                type="text"
                placeholder="이름"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ ...commonInputStyle, width: '511px' }}
              />
              <div style={{ display: 'flex', gap: '12px', width: '511px' }}>
                <input
                  type="text"
                  placeholder="기수"
                  value={generation}
                  onChange={(e) => setGeneration(e.target.value)}
                  style={{ ...commonInputStyle, width: '162.33px' }}
                />
                <input
                  type="text"
                  placeholder="반"
                  value={userClass}
                  onChange={(e) => setUserClass(e.target.value)}
                  style={{ ...commonInputStyle, width: '162.33px' }}
                />
                <input
                  type="text"
                  placeholder="번호"
                  value={userNumber}
                  onChange={(e) => setUserNumber(e.target.value)}
                  style={{ ...commonInputStyle, width: '162.33px' }}
                />
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                width: '511px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <button
                onClick={handleComplete}
                disabled={!isStep4Valid}
                style={{
                  width: '511px',
                  height: '48px',
                  borderRadius: '8px',
                  cursor: isStep4Valid ? 'pointer' : 'not-allowed',
                  backgroundColor: isStep4Valid ? '#E2E2E2' : '#4E4E4E',
                  color: isStep4Valid ? '#000000' : '#888888',
                  border: 'none',
                  fontSize: '16px',
                  fontFamily: 'Pretendard',
                }}
              >
                회원가입 완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
