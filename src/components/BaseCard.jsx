import React, { useState } from 'react';
import HeartIcon from '../assets/BaseCard/cardheart.svg';
import ColorHeartIcon from '../assets/BaseCard/colorheart.svg';
import BookmarkIcon from '../assets/BaseCard/cardbookmark.svg';
import ColorBookmarkIcon from '../assets/BaseCard/colorbookmark.svg';
import SearchIcon from '../assets/BaseCard/cardsearch.svg';

//  onClick 프롭을 추가했습니다.
export default function BaseCard({ item, onClick }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(item?.isBookmarked ?? false);

  const [likes, setLikes] = useState(item?.likes ?? 16);
  const [bookmarks, setBookmarks] = useState(item?.bookmarks ?? 16);
  const [views, setViews] = useState(item?.views ?? 16);

  const maxTags = 3;
  const tagsToShow = item?.tags?.slice(0, maxTags) || [];
  const remainingCount = (item?.tags?.length || 0) - maxTags;

  const handleLike = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지
    setBookmarks((prev) => (bookmarked ? prev - 1 : prev + 1));
    setBookmarked(!bookmarked);
  };

  return (
    <div
      // 카드 전체 클릭 시 상세 페이지로 이동
      onClick={onClick}
      className="group flex w-[200px] cursor-pointer flex-col text-white"
    >
      {/* 1. 이미지 영역 (서버 필드 firstImageUrl와 로컬 image 모두 대응) */}
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {item?.image || item?.firstImageUrl ? (
          <img
            src={item.image || item.firstImageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      {/* 2. 텍스트 영역 (content와 description 모두 대응) */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold text-[#FFFFFF]">
          {item?.title || '제목'}
        </h4>
        <p className="text-[14px] font-light text-[#AAAAAA]">
          {item?.author || '작성자'}
        </p>
        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] font-light text-[#AAAAAA]">
          {item?.description || item?.content}
        </p>
      </div>

      {/* 3. 태그 영역 */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {tagsToShow.map((tag, index) => (
          <span
            key={index}
            className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[10px] text-[12px] text-[#FFFFFF]"
          >
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="flex h-[22px] min-w-[31px] items-center justify-center rounded-full bg-[#2E2E2E] px-[8px] text-[12px] text-[#FFFFFF]">
            +{remainingCount}
          </span>
        )}
      </div>

      {/* 4. 아이콘 영역 */}
      <div className="mt-[16px] flex items-center gap-[12px]">
        <button
          onClick={handleLike}
          className="flex items-center gap-[4px] outline-none"
        >
          <img
            src={liked ? ColorHeartIcon : HeartIcon}
            alt="likes"
            className="h-[16px] w-[16px] flex-shrink-0 object-contain"
          />
          <span
            className={`text-[13px] ${liked ? 'text-[#FF4D4D]' : 'text-zinc-500'}`}
          >
            {likes}
          </span>
        </button>

        <button
          onClick={handleBookmark}
          className="flex items-center gap-[4px] outline-none"
        >
          <img
            src={bookmarked ? ColorBookmarkIcon : BookmarkIcon}
            alt="bookmarks"
            className="h-[16px] w-[16px] flex-shrink-0 object-contain"
          />
          <span
            className={`text-[13px] ${bookmarked ? 'text-[#FFD700]' : 'text-zinc-500'}`}
          >
            {bookmarks}
          </span>
        </button>

        <div className="flex items-center gap-[4px] opacity-60">
          <img
            src={SearchIcon}
            alt="views"
            className="h-[16px] w-[16px] flex-shrink-0"
          />
          <span className="text-[13px] text-zinc-500">{views}</span>
        </div>
      </div>
    </div>
  );
}
