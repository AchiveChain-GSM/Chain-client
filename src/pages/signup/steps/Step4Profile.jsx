// src/pages/Signup/steps/Step4Profile.jsx
import React from 'react';

const inputBase =
  "h-12 rounded-[8px] bg-[#191919] px-4 text-[16px] text-white outline-none font-['Pretendard'] placeholder:text-zinc-500";

export default function Step4Profile({
  userName,
  setUserName,
  generation,
  setGeneration,
  userClass,
  setUserClass,
  userNumber,
  setUserNumber,
  onNumberChange,
  errorMessage,
  isStep4Valid,
  onComplete,
}) {
  return (
    <div className="relative flex h-[308px] w-[559px] flex-col items-center rounded-[12px] bg-[#1D1D1D] p-6">
      <div className="flex w-[511px] flex-col gap-3">
        <input
          type="text"
          placeholder="이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`${inputBase} w-[511px]`}
        />

        <div className="flex w-[511px] gap-3">
          <input
            type="text"
            placeholder="기수"
            value={generation}
            onChange={onNumberChange(setGeneration)}
            className={`${inputBase} w-[162.33px]`}
          />
          <input
            type="text"
            placeholder="반"
            value={userClass}
            onChange={onNumberChange(setUserClass)}
            className={`${inputBase} w-[162.33px]`}
          />
          <input
            type="text"
            placeholder="번호"
            value={userNumber}
            onChange={onNumberChange(setUserNumber)}
            className={`${inputBase} w-[162.33px]`}
          />
        </div>
      </div>

      <div className="mt-[10px] h-5 w-[511px] text-right">
        {errorMessage && (
          <span className="font-['Pretendard'] text-[14px] text-[#FF5050]">
            {errorMessage}
          </span>
        )}
      </div>

      <div className="absolute bottom-6 flex w-[511px] flex-col items-center">
        <button
          onClick={onComplete}
          disabled={!isStep4Valid}
          className={[
            "h-12 w-[511px] rounded-[8px] font-['Pretendard'] text-[16px] transition-colors",
            isStep4Valid
              ? 'cursor-pointer bg-[#E2E2E2] text-black'
              : 'cursor-not-allowed bg-[#4E4E4E] text-[#888888]',
          ].join(' ')}
          type="button"
        >
          회원가입 완료
        </button>
      </div>
    </div>
  );
}
