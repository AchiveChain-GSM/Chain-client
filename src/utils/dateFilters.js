// src/utils/dateFilters.js
import { POST_FILTER } from './postFilters';

export function applyDateFilter(list, filterKey) {
  if (!Array.isArray(list)) return [];
  const now = new Date();

  // createAt / createdAt / created_at 혼재 방어
  const getDate = (post) =>
    new Date(post?.createAt ?? post?.createdAt ?? post?.created_at ?? 0);

  if (filterKey === POST_FILTER.TODAY) {
    return list.filter((p) => getDate(p).toDateString() === now.toDateString());
  }

  if (filterKey === POST_FILTER.WEEK) {
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    return list.filter((p) => getDate(p) >= oneWeekAgo);
  }

  if (filterKey === POST_FILTER.YEAR) {
    return list.filter((p) => getDate(p).getFullYear() === now.getFullYear());
  }

  return list;
}
