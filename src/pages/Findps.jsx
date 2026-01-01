// src/pages/Findps.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EMAIL_DOMAIN = '@gsm.hs.kr';

const inputBase =
  "h-12 rounded-[8px] bg-[#191919] px-4 text-[16px] text-white outline-none font-['Pretendard'] placeholder:text-zinc-500";

export default function Findps() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [mailSent, setMailSent] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* =========================
   * STEP 1: 이메일 인증
   * ========================= */
  const handleEmailAuth = async () => {
    if (!email.endsWith(EMAIL_DOMAIN)) {
      setErrorMessage(
        `${EMAIL_DOMAIN} 도메인을 사용하는 계정으로 이메일을 인증해주세요`,
      );
      return;
    }

    try {
      await api.post('/api/auth/send-email', { email });
      setErrorMessage('');
      setMailSent(true);
      alert('메일이 발송되었습니다.');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '메일 발송에 실패했습니다.',
      );
    }
  };

  const handleVerifyNext = async () => {
    if (!authCode.trim()) {
      setErrorMessage('토큰을 입력해주세요.');
      return;
    }

    try {
      setErrorMessage(''); // 이전 에러 초기화
      // ✅ 서버 명세에 따라 'code' 대신 'token'으로 보낼 수도 있습니다. (VerifyEmail.jsx 참고)
      await api.post('/api/auth/verify-email', {
        email: email.trim(),
        token: authCode.trim(), // 또는 백엔드 스펙에 따라 code: authCode
      });

      // ✅ 인증 성공 시에만 다음 단계로
      setStep(2);
      setErrorMessage('');
    } catch (error) {
      // ✅ 여기서 에러를 잡아서 화면에 표시해야 합니다.
      const status = error.response?.status;
      const msg = error.response?.data?.message || error.response?.data?.body;

      if (status === 401) {
        setErrorMessage('토큰이 일치하지 않습니다.');
      } else {
        setErrorMessage(msg || '토큰 확인 중 오류가 발생했습니다.');
      }

      // ⚠️ 여기서 navigate('/') 등을 호출하지 않도록 주의하세요.
    }
  };

  /* =========================
   * STEP 2: 비밀번호 재설정
   * ========================= */
  const validatePassword = (pw) => {
    const hasLetter = /[a-z]/i.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return hasLetter && hasNumber && pw.length >= 8;
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
      await api.post('/api/auth/change-password', {
        email,
        password,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.',
      );
    }
  };

  const canNext = authCode.length > 0;

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#191919] pt-[15vh]">
      <div className="mb-12 flex h-[42px] items-center justify-center">
        <h1 className="text-[32px] text-white">
          {step === 1 ? '비밀번호 찾기' : '비밀번호 재설정'}
        </h1>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="relative h-[308px] w-[559px] rounded-[12px] bg-[#1D1D1D] p-6">
          <div className="mb-3 flex gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputBase} w-[393px]`}
              placeholder="이메일"
            />
            <button
              onClick={handleEmailAuth}
              className="h-12 w-[106px] rounded-[8px] bg-white text-black"
              type="button"
            >
              이메일 인증
            </button>
          </div>

          <input
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            disabled={!mailSent}
            className={`${inputBase} w-full ${mailSent ? '' : 'opacity-50'}`}
          />

          <div className="mt-2 text-right text-[#FF5050]">{errorMessage}</div>

          <div className="absolute bottom-6 w-full px-6">
            <button
              onClick={handleVerifyNext}
              disabled={!canNext}
              className="h-12 w-full rounded-[8px] bg-[#E2E2E2] text-black disabled:bg-[#4E4E4E] disabled:text-[#888]"
              type="button"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="relative h-[308px] w-[559px] rounded-[12px] bg-[#1D1D1D] p-6">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputBase} mb-3 w-full`}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${inputBase} w-full`}
          />

          <div className="mt-2 text-right text-[#FF5050]">{errorMessage}</div>

          <div className="absolute bottom-6 w-full px-6">
            <button
              onClick={handleResetComplete}
              className="h-12 w-full rounded-[8px] bg-[#E2E2E2] text-black"
              type="button"
            >
              비밀번호 재설정 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
