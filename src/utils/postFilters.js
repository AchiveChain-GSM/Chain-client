// src/constants/postFilters.js

export const POST_FILTER = {
  RECENT: 'recent',
  LIKES: 'likes',
  VIEWS: 'views',
  TODAY: 'today',
  WEEK: 'week',
  YEAR: 'year',
};

// FilterModal이 popular / most-view 같은 값을 주면 표준키로 변환
export function normalizeFilterKey(raw) {
  const v = String(raw ?? '').trim();

  if (v === 'popular') return POST_FILTER.LIKES;
  if (v === 'most-view') return POST_FILTER.VIEWS;

  if (Object.values(POST_FILTER).includes(v)) return v;
  return POST_FILTER.RECENT;
}

// 화면에 보여줄 라벨
export function getFilterLabel(filterKey) {
  switch (filterKey) {
    case POST_FILTER.LIKES:
      return '좋아요 많은 순';
    case POST_FILTER.VIEWS:
      return '조회수 높은 순';
    case POST_FILTER.TODAY:
      return '오늘';
    case POST_FILTER.WEEK:
      return '이번 주';
    case POST_FILTER.YEAR:
      return '올해';
    default:
      return '최신순';
  }
}
