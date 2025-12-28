// src/pages/Signup/steps/Step1Agreement.jsx
import React from 'react';

export default function Step1Agreement({
  agreed,
  setAgreed,
  checkIcon,
  onNext,
  onBack,
}) {
  return (
    <div className="flex h-[600px] w-[894px] flex-col rounded-[12px] bg-[#1D1D1D] p-8">
      <div className="flex-1 overflow-hidden rounded-[8px] bg-[#191919] p-6 text-left font-['Pretendard'] text-[14px] font-normal leading-[1.7] tracking-[-0.02em] text-white">
        [개인정보 수집 및 이용 동의]
        <br />
        <br />
        체인은 다음과 같이 개인정보를 수집 및 이용하고 있습니다.
        <br />
        <br />
        • 수집 및 이용 목적: 회원 가입, 서비스 제공, 이용자 식별, 부정이용 방지
        <br />
        • 항목: 아이디, 닉네임, 비밀번호, 이메일주소
        <br />
        • 수집 및 이용 목적: 본인확인, 이용자 식별, 부정이용 방지, 중복가입 방지
        <br />
        • 항목: 이름, 학년, 반, 번호
        <br />
        • 보유 및 이용기간: 회원탈퇴일로부터 30일 (법령에 특별한 규정이 있을 경우
        관련 법령에 따라, 부정이용기록은 회원탈퇴일로부터 최대 5년)
        <br />
        <br />
        동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 불가능합니다.
        <br />
        <br />※ 그 외의 사항 및 자동 수집 정보와 관련된 사항은
        개인정보처리방침을 따릅니다.
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-center gap-3 font-['Pretendard'] text-[16px] font-normal tracking-[-0.02em] leading-[1.4] text-white">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="hidden"
          />

          <div className="relative z-[1] flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#191919] transition-all">
            {agreed && (
              <img
                src={checkIcon}
                alt="check"
                className="h-[14px] w-[14px] pointer-events-none"
              />
            )}
          </div>

          <span>[개인정보 수집 및 이용 동의] (필수)</span>
        </label>

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={onNext}
            disabled={!agreed}
            className={[
              'h-12 w-[830px] rounded-[8px] font-[',
              "'Pretendard'",
              '] text-[16px] transition-colors',
              agreed
                ? 'cursor-pointer bg-white text-black'
                : 'cursor-not-allowed bg-[#4E4E4E] text-[#888888]',
            ].join('')}
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
    </div>
  );
}
