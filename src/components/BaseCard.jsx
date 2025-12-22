import React, { useState } from 'react';
import HeartIcon from '../assets/BaseCard/cardheart.svg';
import ColorHeartIcon from '../assets/BaseCard/colorheart.svg';
import BookmarkIcon from '../assets/BaseCard/cardbookmark.svg';
import ColorBookmarkIcon from '../assets/BaseCard/colorbookmark.svg';
import SearchIcon from '../assets/BaseCard/cardsearch.svg';

export default function BaseCard({ item }) {
  const [liked, setLiked] = useState(false);
  // ✅ 데이터에 있는 북마크 상태를 초기값으로 설정
  const [bookmarked, setBookmarked] = useState(item?.isBookmarked ?? false);

  const [likes, setLikes] = useState(item?.likes ?? 16);
  const [bookmarks, setBookmarks] = useState(item?.bookmarks ?? 16);
  const [views, setViews] = useState(item?.views ?? 16);

  const maxTags = 3;
  const tagsToShow = item?.tags?.slice(0, maxTags) || [];
  const remainingCount = (item?.tags?.length || 0) - maxTags;

  const handleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarks((prev) => (bookmarked ? prev - 1 : prev + 1));
    setBookmarked(!bookmarked);
  };

  return (
    <div className="group flex w-[200px] flex-col text-white">
      <div className="relative aspect-[200/120] w-full overflow-hidden rounded-lg bg-[#2A2A2A]">
        {item?.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-[#3F3F3F]" />
        )}
      </div>

      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[18px] font-semibold text-[#FFFFFF]">
          {item?.title || '제목'}
        </h4>
        <p className="text-[14px] font-light text-[#AAAAAA]">
          {item?.author || '작성자'}
        </p>
        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] font-light text-[#AAAAAA]">
          {item?.description}
        </p>
      </div>

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

      <div className="mt-[16px] flex items-center gap-[12px]">
        <button
          onClick={handleLike}
          className="flex items-center gap-[4px] outline-none"
        >
          <img
            src={liked ? ColorHeartIcon : HeartIcon}
            alt="likes"
            style={{ width: '16px', height: '16px' }}
            className="flex-shrink-0 object-contain"
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
          {/* ✅ bookmarked 상태에 따라 ColorBookmarkIcon(노란색)이 뜹니다 */}
          <img
            src={bookmarked ? ColorBookmarkIcon : BookmarkIcon}
            alt="bookmarks"
            style={{ width: '16px', height: '16px' }}
            className="flex-shrink-0 object-contain"
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
            style={{ width: '16px', height: '16px' }}
            className="flex-shrink-0"
          />
          <span className="text-[13px] text-zinc-500">{views}</span>
        </div>
      </div>
    </div>
  );
}
