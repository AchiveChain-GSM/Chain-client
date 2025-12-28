// src/components/postDetail/PostBody.jsx
import { useMemo, useState } from 'react';

import heartIcon from '../../assets/BaseCard/cardheart.svg';
import bookmarkIcon from '../../assets/BaseCard/cardbookmark.svg';

import hoverBookmarkIcon from '../../assets/icon/hoverBookmark.svg';
import hoverHeartIcon from '../../assets/icon/hoverHeart.svg';

import selectBookmarkIcon from '../../assets/icon/selectBookmark.svg';
import selectHeartIcon from '../../assets/icon/selectHeart.svg';

import PostContent from './PostContent';

export default function PostBody({ postData, onToggleLike, onToggleBookmark }) {
  const [hoverLike, setHoverLike] = useState(false);
  const [hoverBookmark, setHoverBookmark] = useState(false);

  const likeIconSrc = postData.isLiked
    ? selectHeartIcon
    : hoverLike
      ? hoverHeartIcon
      : heartIcon;

  const bookmarkIconSrc = postData.isBookmarked
    ? selectBookmarkIcon
    : hoverBookmark
      ? hoverBookmarkIcon
      : bookmarkIcon;

  // ✅ images가 Map 형태(객체)이면 url 배열로 변환
  const imageUrls = useMemo(() => {
    const imgs = postData?.images;

    if (!imgs) return [];

    // Map(Long->url) 형태: { "1": "https://...", "2": "https://..." }
    if (typeof imgs === 'object' && !Array.isArray(imgs)) {
      return Object.values(imgs).filter(Boolean);
    }

    // 혹시 배열로 주는 서버도 있으니 방어
    if (Array.isArray(imgs)) {
      return imgs.filter(Boolean);
    }

    return [];
  }, [postData?.images]);

  // ✅ tags가 string[]이 아닐 수 있어 정규화
  const tags = useMemo(() => {
    const raw = postData?.tags ?? [];
    const arr = Array.isArray(raw) ? raw : [raw];
    const flat = arr
      .map((t) =>
        typeof t === 'string' ? t : t?.name ?? t?.tagName ?? t?.value ?? null,
      )
      .map((t) => (t == null ? '' : String(t)))
      .flatMap((t) => t.split(/[\s,]+/g))
      .map((t) => t.trim().replace(/^#+/, ''))
      .filter(Boolean);

    const seen = new Set();
    const uniq = [];
    for (const x of flat) {
      if (seen.has(x)) continue;
      seen.add(x);
      uniq.push(x);
    }
    return uniq;
  }, [postData?.tags]);

  return (
    <>
      {/* ✅ 첨부 이미지 (상세에서 안 보이던 문제 해결) */}
      {imageUrls.length > 0 && (
        <div className="mb-8 flex gap-3 overflow-x-auto">
          {imageUrls.map((url, idx) => (
            <img
              key={`${url}-${idx}`}
              src={url}
              alt=""
              className="h-40 w-auto rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      {/* 본문 */}
      <PostContent html={postData.content} />

      {/* 태그 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="rounded-lg bg-[#2A2A2A] px-3 py-1.5 text-[13px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 하단 지표 */}
      <div className="mb-12 flex items-center gap-4 text-[13px] text-zinc-500">
        {/* 좋아요 */}
        <button
          type="button"
          onMouseEnter={() => setHoverLike(true)}
          onMouseLeave={() => setHoverLike(false)}
          onClick={onToggleLike}
          className="flex items-center gap-2"
        >
          <img src={likeIconSrc} alt="like" className="h-5 w-5" />
          {/* ✅ 백엔드 키 likes */}
          <span>{postData.likes ?? 0}</span>
        </button>

        {/* 북마크 */}
        <button
          type="button"
          onMouseEnter={() => setHoverBookmark(true)}
          onMouseLeave={() => setHoverBookmark(false)}
          onClick={onToggleBookmark}
          className="flex items-center gap-2"
        >
          <img src={bookmarkIconSrc} alt="bookmark" className="h-5 w-5" />
          {/* ✅ 백엔드 키 bookmarks */}
          <span>{postData.bookmarks ?? 0}</span>
        </button>

        {/* 조회수 */}
        <div className="flex items-center gap-2">
          <span>조회</span>
          {/* ✅ 백엔드 키 views */}
          <span>{postData.views ?? 0}</span>
        </div>
      </div>
    </>
  );
}
