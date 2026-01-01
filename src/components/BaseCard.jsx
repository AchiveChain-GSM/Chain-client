import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeartIcon from '../assets/BaseCard/cardheart.svg';
import ColorHeartIcon from '../assets/icon/selectHeart.svg';
import BookmarkIcon from '../assets/BaseCard/cardbookmark.svg';
import ColorBookmarkIcon from '../assets/icon/selectBookmark.svg';
import SearchIcon from '../assets/BaseCard/cardsearch.svg';

import { togglePostBookmark } from '../api/reactions';
// import { togglePostLike } from '../api/reactions'; // 나중에 연결용

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://port-0-chain-server-mjgfqy3sbea3654a.sel3.cloudtype.app';

function toAbsUrl(u) {
  if (!u) return null;
  const s = String(u).trim();
  if (!s) return null;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  // 상대경로면 baseURL 붙이기
  return `${API_BASE_URL}${s.startsWith('/') ? '' : '/'}${s}`;
}

// ✅ 다양한 응답 구조에서 “첫 이미지 URL” 뽑기
function pickFirstImageUrl(data) {
  if (!data) return null;

  // 1) 이미 쓰고 있는 키들 우선
  const direct =
    data.firstImageUrl ||
    data.image ||
    data.thumbnail ||
    data.imageUrl ||
    data.previewImageUrl;

  if (direct) return direct;

  // 2) 배열 형태
  const arrCandidate =
    (Array.isArray(data.images) && data.images[0]) ||
    (Array.isArray(data.imageUrls) && data.imageUrls[0]) ||
    (Array.isArray(data.imageList) && data.imageList[0]);

  if (typeof arrCandidate === 'string') return arrCandidate;

  // 3) 객체 배열 형태 (예: [{url:...}] [{imageUrl:...}])
  const objCandidate =
    (Array.isArray(data.images) && data.images[0]?.url) ||
    (Array.isArray(data.images) && data.images[0]?.imageUrl) ||
    (Array.isArray(data.imageUrls) && data.imageUrls[0]?.url);

  return objCandidate || null;
}

export default function BaseCard({ item }) {
  const navigate = useNavigate();
  /** -------------------------
   * 상태 (서버 기준 동기화)
   * ------------------------ */
  const [bookmarked, setBookmarked] = useState(!!item?.isBookmarked);
  const [bookmarks, setBookmarks] = useState(
    item?.bookmarkCount ?? item?.bookmarks ?? 0,
  );

  const [liked, setLiked] = useState(!!item?.isLiked);
  const [likes, setLikes] = useState(item?.likeCount ?? item?.likes ?? 0);

  const views = item?.views ?? 0;

  /** -------------------------
   * item 변경 시 상태 재동기화
   * ------------------------ */
  useEffect(() => {
    setBookmarked(!!item?.isBookmarked);
    setBookmarks(item?.bookmarkCount ?? item?.bookmarks ?? 0);

    setLiked(!!item?.isLiked);
    setLikes(item?.likeCount ?? item?.likes ?? 0);
  }, [item]);

  /** -------------------------
   * 이미지 썸네일 (⭐ 핵심)
   * ------------------------ */
  const thumbnail = useMemo(() => {
    const raw = pickFirstImageUrl(item);
    return toAbsUrl(raw);
  }, [item]);

  /** -------------------------
   * 북마크 토글 (서버 연동)
   * ------------------------ */
  const handleBookmark = async () => {
    const prev = bookmarked;
    const pid = item?.postId ?? item?.id;
    if (!pid) return;

    // 낙관적 업데이트
    setBookmarked(!prev);
    setBookmarks((c) => Math.max(0, prev ? c - 1 : c + 1));

    try {
      await togglePostBookmark(pid);
    } catch (e) {
      console.error('북마크 토글 실패', e);
      // 롤백
      setBookmarked(prev);
      setBookmarks((c) => Math.max(0, prev ? c + 1 : c - 1));
    }
  };

  /** -------------------------
   * 좋아요 (일단 UI만 / 추후 서버 연결)
   * ------------------------ */
  const handleLike = async () => {
    const prev = liked;
    setLiked(!prev);
    setLikes((c) => Math.max(0, prev ? c - 1 : c + 1));
    // await togglePostLike(item?.postId ?? item?.id);
  };

  /** -------------------------
   * 태그
   * ------------------------ */
  const maxTags = 3;
  const tags = Array.isArray(item?.tags)
    ? item.tags
        .map((t) =>
          typeof t === 'string' ? t : (t?.name ?? t?.tagName ?? t?.value ?? ''),
        )
        .flatMap((t) => String(t).split(/[\s,]+/g))
        .map((t) => t.trim().replace(/^#+/, ''))
        .filter(Boolean)
    : [];

  const tagsToShow = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  return (
    <div className="group flex w-[200px] flex-col text-white">
      <div
        className="relative aspect-[200/120] w-full cursor-pointer overflow-hidden rounded-lg bg-[#2A2A2A]"
        onClick={() => {
          const postId = item?.postId ?? item?.id;
          if (!postId) return;
          navigate(`/posts/${postId}`, {
            state: { post: item },
          });
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item?.title ?? 'thumbnail'}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              // 이미지 깨지면 fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold">
          {item?.title || '제목'}
        </h4>
        <p className="text-[14px] text-[#AAAAAA]">
          {item?.authorName ?? item?.author ?? item?.userName ?? '작성자'}
        </p>
      </div>

      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {tagsToShow.map((tag, i) => (
          <span
            key={i}
            className="rounded-xl bg-[#2E2E2E] px-[10px] py-1 text-[12px]"
          >
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="rounded-full bg-[#2E2E2E] px-[8px] text-[12px]">
            +{remainingCount}
          </span>
        )}
      </div>

      <div className="mt-[16px] flex items-center gap-[12px]">
        <button
          
          className="flex items-center gap-[4px]"
        >
          <img
            src={liked ? ColorHeartIcon : HeartIcon}
            alt="likes"
            className="h-[16px] w-[16px]"
          />
          <span className={liked ? 'text-[#FF4D4D]' : 'text-zinc-500'}>
            {likes}
          </span>
        </button>

        <button
         
          className="flex items-center gap-[4px]"
        >
          <img
            src={bookmarked ? ColorBookmarkIcon : BookmarkIcon}
            alt="bookmark"
            className="h-[16px] w-[16px]"
          />
          <span className={bookmarked ? 'text-[#FFD700]' : 'text-zinc-500'}>
            {bookmarks}
          </span>
        </button>

        <div className="flex items-center gap-[4px] opacity-60">
          <img src={SearchIcon} alt="views" className="h-[16px] w-[16px]" />
          <span className="text-zinc-500">{views}</span>
        </div>
      </div>
    </div>
  );
}
