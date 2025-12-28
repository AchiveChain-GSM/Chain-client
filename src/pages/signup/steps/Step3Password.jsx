// src/pages/signup/steps/Step3Password.jsx
import React, { useMemo } from 'react';

const inputBase =
  "h-12 w-full rounded-[8px] bg-[#191919] px-4 text-[16px] text-white outline-none font-['Pretendard'] placeholder:text-zinc-500";

export default function Step3Password({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errorMessage,
  onNext,
  onBack,
}) {
  const mismatch = useMemo(() => {
    if (!confirmPassword) return false;
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const canNext = password !== '' && confirmPassword !== '' && !mismatch;

  return (
    <div className="relative flex h-[308px] w-[559px] flex-col items-center rounded-[12px] bg-[#1D1D1D] p-6">
      <div className="flex w-[511px] flex-col gap-3">
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputBase}
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputBase}
        />

        {/* ✅ 실시간 mismatch 문구 */}
        <div className="mt-1 min-h-[18px] w-full text-right">
          {mismatch ? (
            <span className="font-['Pretendard'] text-[14px] text-[#FF5050]">
              비밀번호 확인이 다릅니다.
            </span>
          ) : null}
        </div>
      </div>

      {/* 기존 에러 메시지(규칙/다음 클릭시) */}
      <div className="mt-[2px] min-h-[18px] w-[511px] text-right">
        {errorMessage ? (
          <span className="font-['Pretendard'] text-[14px] text-[#FF5050]">
            {errorMessage}
          </span>
        ) : null}
      </div>

      <div className="absolute bottom-6 flex w-[511px] flex-col items-center gap-3">
        <button
          onClick={onNext}
          disabled={!canNext}
          className={[
            "h-12 w-[511px] rounded-[8px] font-['Pretendard'] text-[16px] transition-colors",
            canNext
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
