import { useState } from 'react';
import checkIcon from '../../assets/icon/check.svg';
import closeIcon from '../../assets/uploadIcon/x.svg';

export default function ReportModal({ postId, onClose }) {
  // --- [신고 모달] 다중 선택 + 기타 입력 ---
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

  const [selectedReportReasons, setSelectedReportReasons] = useState([]); // string[]
  const [reportEtcText, setReportEtcText] = useState('');

  const toggleReportReason = (reason) => {
    setSelectedReportReasons((prev) => {
      const exists = prev.includes(reason);
      const next = exists
        ? prev.filter((r) => r !== reason)
        : [...prev, reason];

      // '기타' 해제 시 입력값도 비워주기
      if (exists && reason === '기타') setReportEtcText('');

      return next;
    });
  };

  const handleReportSubmit = () => {
    if (selectedReportReasons.length === 0) {
      alert('신고 사유를 1개 이상 선택해주세요.');
      return;
    }

    if (selectedReportReasons.includes('기타') && !reportEtcText.trim()) {
      alert('기타 사유를 입력해주세요.');
      return;
    }

    // 나중에 백엔드 붙일 때 보낼 payload 예시
    const payload = {
      targetType: 'POST',
      targetId: postId,
      reasonCodes: selectedReasons, // TODO: 백엔드가 코드 형태를 원하면 여기서 매핑
      message: selectedReasons.includes('기타') ? etcReason.trim() : '',
    };

    console.log('REPORT_PAYLOAD', payload);

    alert('신고가 정상적으로 접수되었습니다.');
    onClose?.();

    // 모달 닫을 때 초기화
    setSelectedReportReasons([]);
    setReportEtcText('');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[512px] rounded-2xl bg-[#1D1D1D] p-6 pb-4 shadow-2xl">
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
            const checked = selectedReportReasons.includes(reason);

            return (
              <label
                key={reason}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3',
                  'bg-[#2A2A2A] transition-colors hover:bg-[#333]',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleReportReason(reason)}
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

        {selectedReportReasons.includes('기타') && (
          <div className="mb-6">
            <input
              value={reportEtcText}
              onChange={(e) => setReportEtcText(e.target.value)}
              placeholder="기타 사유를 입력해주세요."
              className="h-[44px] w-full rounded-lg bg-[#191919] px-4 text-sm text-white outline-none"
            />
          </div>
        )}

        <button
          onClick={handleReportSubmit}
          disabled={selectedReportReasons.length === 0}
          className={[
            'mb-3 w-full rounded-lg py-3 text-sm font-medium transition-colors',
            selectedReportReasons.length > 0
              ? 'bg-white text-black hover:bg-white/90'
              : 'cursor-not-allowed bg-white/10 text-zinc-500',
          ].join(' ')}
        >
          신고 제출
        </button>
      </div>
    </div>
  );
}
