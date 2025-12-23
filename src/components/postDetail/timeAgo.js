// src/utils/timeAgo.js
export function getTimeAgo(input) {
  if (!input) return '';

  // Date / number / string 모두 받기
  const createdAt =
    input instanceof Date ? input : new Date(input);

  // invalid date 방어
  if (Number.isNaN(createdAt.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();

  // 미래 시간이 들어오면 "방금 전" 처리
  if (diffMs < 0) return '방금 전';

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return '방금 전';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
}

export function formatKoreanDate(input) {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
