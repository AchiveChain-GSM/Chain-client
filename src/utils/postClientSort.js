function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getCreatedAt(p) {
  const raw = p?.createdAt ?? p?.createAt ?? p?.created_at ?? null;
  const t = raw ? new Date(raw).getTime() : NaN;
  return Number.isFinite(t) ? t : 0;
}

export function applyClientSortAndFilter(posts, { filter = 'recent', keyword = '' } = {}) {
  let list = Array.isArray(posts) ? [...posts] : [];

  // 1) 날짜 필터 (today/week/year)
  if (filter === 'today' || filter === 'week' || filter === 'year') {
    const now = new Date();

    list = list.filter((p) => {
      const t = getCreatedAt(p);
      if (!t) return false;
      const d = new Date(t);

      if (filter === 'today') return d.toDateString() === now.toDateString();

      if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }

      // year
      return d.getFullYear() === now.getFullYear();
    });
  }

  // 2) 정렬
  if (filter === 'likes' || filter === 'popular') {
    list.sort((a, b) => num(b.likeCount ?? b.likes) - num(a.likeCount ?? a.likes));
  } else if (filter === 'views' || filter === 'most-view') {
    list.sort((a, b) => num(b.views) - num(a.views));
  } else {
    // recent
    list.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));
  }

  // 3) 검색어
  const kw = String(keyword || '').trim().toLowerCase();
  if (kw) {
    list = list.filter((p) => String(p?.title ?? '').toLowerCase().includes(kw));
  }

  return list;
}
