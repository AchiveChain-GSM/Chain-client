// src/pages/Signup/steps/Step2EmailVerify.jsx
import React from 'react';

const inputBase =
  "h-12 rounded-[8px] bg-[#191919] px-4 text-[16px] text-white outline-none font-['Pretendard'] placeholder:text-zinc-500";

export default function Step2EmailVerify({
  email,
  onChangeEmail,
  mailSent,
  emailToken,
  onChangeToken,
  emailVerified,

  inlineMessage,
  inlineType,

  onSendEmail,
  onVerifyToken,
  onNext,
  onBack,
}) {
  const inlineClass =
    inlineType === 'success'
      ? 'text-[#B6F5C2]'
      : inlineType === 'error'
        ? 'text-[#FF5050]'
        : 'text-[#B8B8B8]';

  // ✅ 토큰 확인 버튼 활성 조건
  const canVerify = mailSent; // 원하면 mailSent && emailToken.trim() 으로 더 엄격하게 가능

  return (
    <div className="relative flex h-[308px] w-[559px] flex-col items-center rounded-[12px] bg-[#1D1D1D] p-6">
      {/* 이메일 입력 + 이메일 인증 */}
      <div className="mb-3 flex w-[511px] gap-3">
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          className={`${inputBase} w-[393px]`}
        />
        <button
          onClick={onSendEmail}
          className="h-12 w-[106px] rounded-[8px] bg-white text-[14px] text-black"
          type="button"
        >
          이메일 인증
        </button>
      </div>

      {/* 토큰 입력 + 토큰 확인 */}
      <div className="mb-2 flex w-[511px] gap-3">
        <input
          type="text"
          placeholder="메일에 온 토큰을 붙여넣기"
          value={emailToken}
          onChange={(e) => onChangeToken(e.target.value)}
          className={`${inputBase} w-[393px] ${mailSent ? '' : 'opacity-50'}`}
          disabled={!mailSent} // ✅ (선택) 메일 발송 전 토큰 입력도 막기
        />
        <button
          onClick={onVerifyToken}
          disabled={!canVerify} // ✅ 핵심
          className={[
            'h-12 w-[106px] rounded-[8px] text-[14px]',
            canVerify
              ? 'cursor-pointer bg-white text-black'
              : 'cursor-not-allowed bg-[#4E4E4E] text-[#888888]',
          ].join(' ')}
          type="button"
          title={!mailSent ? '먼저 이메일 인증을 눌러 메일을 받아주세요.' : ''}
        >
          토큰 확인
        </button>
      </div>

      {/* 토큰 입력창 아래 메시지 */}
      <div className="mb-3 h-5 w-[511px] text-right">
        {inlineMessage ? (
          <span className={`font-['Pretendard'] text-[14px] ${inlineClass}`}>
            {inlineMessage}
          </span>
        ) : null}
      </div>

      

      {/* 하단 버튼 */}
      <div className="absolute bottom-6 flex w-[511px] flex-col items-center gap-3">
        <button
          onClick={onNext}
          disabled={!emailVerified}
          className={[
            "h-12 w-[511px] rounded-[8px] font-['Pretendard'] text-[16px] transition-colors",
            emailVerified
              ? 'cursor-pointer bg-[#E2E2E2] text-black'
              : 'cursor-not-allowed bg-[#4E4E4E] text-[#888888]',
          ].join(' ')}
          type="button"
        >
          다음
        </button>

        <button
          onClick={onBack}
          className="cursor-pointer bg-transparent font-['Pretendard'] text-[14px] text-white"
          type="button"
        >
          이전으로
        </button>
      </div>
    </div>
  );
}
