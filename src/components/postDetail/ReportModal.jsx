// src/components/postDetail/ReportModal.jsx
import { useState } from 'react';
import checkIcon from '../../assets/icon/check.svg';
import closeIcon from '../../assets/uploadIcon/x.svg';
import { reportPost } from '../../api/reports'; 

export default function ReportModal({ postId, onClose }) {
  const REPORT_REASONS = [
    '욕설·비하',
    '혐오·차별 발언',
    '음란물 / 선정적',
    '폭력·자해 조장',
    '불법 정보',
    '스팸·광고',
    '개인정보 노출',
    '저작권 침해',
    '기타',
  ];

  const [selectedReasons, setSelectedReasons] = useState([]);
  const [etcText, setEtcText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleReason = (reason) => {
    setSelectedReasons((prev) => {
      const exists = prev.includes(reason);
      const next = exists
        ? prev.filter((r) => r !== reason)
        : [...prev, reason];
      if (exists && reason === '기타') setEtcText('');
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      alert('신고 사유를 1개 이상 선택해주세요.');
      return;
    }
    if (selectedReasons.includes('기타') && !etcText.trim()) {
      alert('기타 사유를 입력해주세요.');
      return;
    }
    if (submitting) return;

    const title = selectedReasons.includes('기타')
      ? '기타 사유 포함 신고'
      : '일반 신고';
    const description = selectedReasons.includes('기타')
      ? `[사유: ${selectedReasons.join(', ')}] 상세: ${etcText}`
      : selectedReasons.join(', ');

    try {
      setSubmitting(true);
      // ✅ 수정된 posts.js의 reportPost 호출
      await reportPost(postId, { title, description });
      alert('신고가 정상적으로 접수되었습니다.');
      onClose?.();
    } catch (e) {
      console.error('[report fail]', e?.response?.status);
      alert('신고 처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose} // ✅ 배경 클릭 닫기
    >
      <div
        className="w-[512px] rounded-2xl bg-[#1D1D1D] p-6 pb-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭은 닫히지 않게
      >
        <div className="relative mb-4 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white">자료 신고하기</h3>

          <button type="button" onClick={onClose} className="absolute right-0">
            <img
              src={closeIcon}
              alt="닫기"
              className="h-5 w-5 opacity-70 hover:opacity-100"
            />
          </button>
        </div>

        <div className="mb-3 flex flex-col gap-2">
          {REPORT_REASONS.map((reason) => {
            const checked = selectedReasons.includes(reason);
            return (
              <label
                key={reason}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#2A2A2A] px-4 py-3 transition-colors hover:bg-[#333]"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleReason(reason)}
                />
                <span className="flex h-4 w-4 items-center justify-center">
                  {checked && (
                    <img src={checkIcon} alt="" className="h-4 w-4" />
                  )}
                </span>
                <span className="text-sm text-zinc-200">{reason}</span>
              </label>
            );
          })}
        </div>

        {selectedReasons.includes('기타') && (
          <div className="mb-6">
            <input
              value={etcText}
              onChange={(e) => setEtcText(e.target.value)}
              placeholder="기타 사유를 입력해주세요."
              className="h-[44px] w-full rounded-lg bg-[#191919] px-4 text-sm text-white outline-none"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedReasons.length === 0 || submitting}
          className={[
            'mb-3 w-full rounded-lg py-3 text-sm font-medium transition-colors',
            selectedReasons.length > 0
              ? 'bg-white text-black hover:bg-white/90'
              : 'cursor-not-allowed bg-white/10 text-zinc-500',
          ].join(' ')}
        >
          {submitting ? '처리 중...' : '신고 제출'}
        </button>
      </div>
    </div>
  );
}
