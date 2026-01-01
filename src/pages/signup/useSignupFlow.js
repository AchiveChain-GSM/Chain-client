// src/pages/Signup/useSignupFlow.js
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';

function isGsmEmail(email) {
  const e = (email ?? '').trim().toLowerCase();
  return e.endsWith('@gsm.hs.kr');
}

export function useSignupFlow({ navigate, axiosConfig }) {
  const [step, setStep] = useState(1);

  // Step1
  const [agreed, setAgreed] = useState(false);

  // Step2
  const [email, setEmail] = useState('');
  const [mailSent, setMailSent] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  // ✅ Step2: 토큰창 아래 메시지
  const [inlineMessage, setInlineMessage] = useState('');
  const [inlineType, setInlineType] = useState('info'); // 'error' | 'success' | 'info'

  // Step3/4 공용 에러(비번/프로필)
  const [errorMessage, setErrorMessage] = useState('');

  // Step3
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step4
  const [userName, setUserName] = useState('');
  const [generation, setGeneration] = useState('');
  const [userClass, setUserClass] = useState('');
  const [userNumber, setUserNumber] = useState('');

  useEffect(() => {
    const resume = sessionStorage.getItem('signupResume') === 'true';

    // (기존 잔여 키 정리)
    ['signupStep', 'signupEmail', 'signupMailSent', 'signupEmailToken'].forEach(
      (k) => sessionStorage.removeItem(k),
    );

    // resume가 아니면 이메일 인증 플래그 제거
    if (!resume) {
      sessionStorage.removeItem('emailVerified');
      sessionStorage.removeItem('pendingEmail');
      setEmailVerified(false);
    }

    setStep(resume ? 2 : 1);

    // 초기화
    setAgreed(false);
    setEmail('');
    setMailSent(false);
    setEmailToken('');
    setPassword('');
    setConfirmPassword('');
    setUserName('');
    setGeneration('');
    setUserClass('');
    setUserNumber('');
    setErrorMessage('');

    setInlineMessage('');
    setInlineType('info');

    sessionStorage.removeItem('signupResume');
  }, []);

  const validatePassword = (pw) => {
    const hasLetter = /[a-z]/i.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const isLongEnough = pw.length >= 8;
    return hasLetter && hasNumber && isLongEnough;
  };

  // ✅ 숫자 입력 버그 해결: 무조건 setter 호출 + 숫자만 남김
  const handleNumberChange = (setter) => (e) => {
    const only = e.target.value.replace(/\D/g, '');
    setter(only);
    setErrorMessage('');
  };

  // ✅ 이메일 변경 시: 인증 상태/메시지 리셋
  const setEmailAndResetVerify = (nextEmail) => {
    setEmail(nextEmail);
    setMailSent(false);
    setEmailToken('');
    setEmailVerified(false);

    setInlineMessage('');
    setInlineType('info');

    setErrorMessage('');

    sessionStorage.removeItem('emailVerified');
    sessionStorage.removeItem('pendingEmail');
  };

  const setEmailTokenPersist = (v) => {
    setEmailToken(v);
    // 토큰 다시 입력하면 이전 결과 메시지 지우기
    setInlineMessage('');
    setInlineType('info');
  };

  // ✅ 1) 메일 발송
  const handleEmailAuth = async () => {
    const trimmed = email.trim();

    // 1-1) 도메인 체크
    if (!isGsmEmail(trimmed)) {
      setInlineType('error');
      setInlineMessage('gsm.hs.kr의 도메인을 사용하는 이메일을 입력해주세요.');
      setMailSent(false);
      return;
    }

    try {
      // 버튼/입력 상태 정리
      setInlineType('info');
      setInlineMessage('인증 메일을 전송 중입니다...');
      setEmailVerified(false);

      // ⚠️ axiosConfig 쓰고 있으면 유지
      await api.post('/api/auth/send-email', { email: trimmed }, axiosConfig);

      setMailSent(true);
      sessionStorage.setItem('pendingEmail', trimmed);
      sessionStorage.removeItem('emailVerified');

      setInlineType('info');
      setInlineMessage(
        '인증 메일을 발송했습니다. 메일의 토큰을 붙여넣어주세요.',
      );
    } catch (error) {
      setMailSent(false);

      const status = error?.response?.status;
      const data = error?.response?.data;
      const msg =
        data?.message || data?.body || (typeof data === 'string' ? data : '');

      // 1-2) 이미 가입된 이메일 (서버가 409 또는 메시지로 내려줄 때)
      if (status === 409 || /이미|중복|exists|already/i.test(msg)) {
        setInlineType('error');
        setInlineMessage('이미 등록된 회원입니다.');
        return;
      }

      setInlineType('error');
      setInlineMessage(
        (typeof msg === 'string' && msg) ||
          '인증 메일 발송에 실패했습니다. 서버 상태를 확인해주세요.',
      );
    }
  };

  // ✅ 2) 토큰 검증
  const handleVerifyToken = async () => {
    const trimmedEmail = email.trim();
    const token = emailToken.trim();

    // 2-1) 메일 발송 전엔 토큰 확인 불가
    if (!mailSent) {
      setInlineType('error');
      setInlineMessage('먼저 이메일 인증을 눌러 메일을 받아주세요.');
      return;
    }

    // 2-2) 도메인 체크 (안전)
    if (!isGsmEmail(trimmedEmail)) {
      setInlineType('error');
      setInlineMessage('gsm.hs.kr의 도메인을 사용하는 이메일을 입력해주세요.');
      return;
    }

    // 2-3) 토큰 입력 체크
    if (!token) {
      setInlineType('error');
      setInlineMessage('메일에 온 토큰을 복사해서 붙여넣어주세요.');
      return;
    }

    try {
      setInlineType('info');
      setInlineMessage('토큰을 확인 중입니다...');
      setEmailVerified(false);

      // ⚠️ 현재 프론트 VerifyEmail.jsx와 동일: body로 email/token 전달
      const res = await api.post(
        '/api/auth/verify-email',
        { email: trimmedEmail, token },
        axiosConfig,
      );

      sessionStorage.setItem('emailVerified', 'true');
      sessionStorage.setItem('pendingEmail', trimmedEmail);

      setEmailVerified(true);
      setInlineType('success');
      setInlineMessage(res?.data?.body || '인증이 완료되었습니다.');
    } catch (e) {
      const status = e?.response?.status;

      setEmailVerified(false);
      sessionStorage.removeItem('emailVerified');
      // pendingEmail은 유지해도 되지만, 인증 실패면 지우는 게 명확
      // (원하면 유지해도 됨)
      // sessionStorage.removeItem('pendingEmail');

      // ✅ 핵심: 401이면 무조건 “토큰이 일치하지 않습니다”
      if (status === 401) {
        setInlineType('error');
        setInlineMessage('토큰이 일치하지 않습니다.');
        return;
      }

      const data = e?.response?.data;
      const msg =
        data?.message || data?.body || (typeof data === 'string' ? data : '');

      setInlineType('error');
      setInlineMessage(
        msg || '인증 토큰이 일치하지 않습니다. (만료/오타 가능)',
      );
    }
  };

  // ✅ Step2 “다음”
  const handleStep2Next = () => {
    const verifiedFlag = sessionStorage.getItem('emailVerified') === 'true';
    const pendingEmail = sessionStorage.getItem('pendingEmail') || '';

    // ✅ 엄격 검증: 세션에 true + pendingEmail이 현재 입력 email과 동일
    const strictVerified =
      verifiedFlag && pendingEmail !== '' && pendingEmail === email.trim();

    setEmailVerified(strictVerified);

    if (!strictVerified) {
      setInlineType('error');
      setInlineMessage('이메일 인증을 완료해주세요. (토큰 확인 후 다음 가능)');
      return;
    }

    setInlineMessage('');
    setInlineType('info');
    setStep(3);
  };

  // ✅ Step3 “다음”
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

  // ✅ Step4 “완료”
  const handleComplete = async () => {
    try {
      // 1) Step4 입력 확인
      if (
        userName.trim() === '' ||
        String(generation).trim() === '' ||
        String(userClass).trim() === '' ||
        String(userNumber).trim() === ''
      ) {
        setErrorMessage('모든 정보를 입력해주세요.');
        return;
      }

      // 2) 이메일 인증 확인 (세션 + 현재 입력 이메일 일치까지)
      const verifiedFlag = sessionStorage.getItem('emailVerified') === 'true';
      const pendingEmail = sessionStorage.getItem('pendingEmail') || '';
      const strictVerified =
        verifiedFlag && pendingEmail !== '' && pendingEmail === email.trim();

      if (!strictVerified) {
        setErrorMessage('이메일 인증을 먼저 완료해주세요.');
        setStep(2);
        return;
      }

      setErrorMessage('');

      const payload = {
        email: email.trim(),
        password,
        userName: userName.trim(),
        generation: String(generation).trim(),
        userClass: String(userClass).trim(),
        userNumber: String(userNumber).trim(),
        // 백엔드에서 무시하더라도 안전하게 전달
        role: 'USER',
      };

      // ✅ 백엔드: POST /api/auth/sign-up
      // ⚠️ auth 요청에는 Authorization 붙으면 꼬일 수 있어 명시적으로 제거
      await api.post('/api/auth/sign-up', payload, {
        ...(axiosConfig ?? {}),
        headers: {
          ...((axiosConfig && axiosConfig.headers) || {}),
          Authorization: undefined,
        },
      });

      // ✅ 프론트에서 프로필 캐시 저장 (백 수정 없이 TopBar 표시 가능)
      const profile = {
        email: email.trim(),
        userName: userName.trim(),
        generation: String(generation).trim(),
        userClass: String(userClass).trim(),
        userNumber: String(userNumber).trim(),
      };

      // TopBar가 읽는 “기본 키” 저장
      localStorage.setItem('email', profile.email);
      localStorage.setItem('userName', profile.userName);
      localStorage.setItem('generation', profile.generation);
      localStorage.setItem('userClass', profile.userClass);
      localStorage.setItem('userNumber', profile.userNumber);

      // 로그인 후에도 복구 가능하도록 “이메일별 캐시” 저장
      localStorage.setItem(`profile:${profile.email}`, JSON.stringify(profile));

      // 3) 인증 관련 세션 정리
      sessionStorage.removeItem('emailVerified');
      sessionStorage.removeItem('pendingEmail');
      sessionStorage.removeItem('signupResume');

      // 4) 로그인 페이지로 이동
      navigate('/login');
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      const msg =
        data?.message ||
        data?.body ||
        (typeof data === 'string' ? data : '') ||
        '회원가입에 실패했습니다. 다시 시도해주세요.';

      if (status === 409) {
        setErrorMessage('이미 등록된 회원입니다.');
        return;
      }

      setErrorMessage(msg);
    }
  };

  // ✅ Step4 버튼 활성 조건
  const isStep4Valid = useMemo(() => {
    return (
      userName.trim() !== '' &&
      generation.trim() !== '' &&
      userClass.trim() !== '' &&
      userNumber.trim() !== ''
    );
  }, [userName, generation, userClass, userNumber]);

  return {
    step,
    setStep,

    agreed,
    setAgreed,

    email,
    mailSent,
    emailVerified,
    emailToken,

    password,
    confirmPassword,

    userName,
    generation,
    userClass,
    userNumber,

    errorMessage,

    // ✅ Step2 inline
    inlineMessage,
    inlineType,

    setEmailAndResetVerify,
    setEmailTokenPersist,
    setPassword,
    setConfirmPassword,
    setUserName,
    setGeneration,
    setUserClass,
    setUserNumber,
    setErrorMessage,

    handleNumberChange,
    handleEmailAuth,
    handleVerifyToken,
    handleStep2Next,
    handleStep3Next,
    handleComplete,

    isStep4Valid,
  };
}
