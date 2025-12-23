import { useState, useEffect } from 'react';

import heartIcon from '../../assets/BaseCard/cardheart.svg';
import bookmarkIcon from '../../assets/BaseCard/cardbookmark.svg';
import searchIcon from '../../assets/BaseCard/cardsearch.svg';

import hoverBookmarkIcon from '../../assets/icon/hoverBookmark.svg';
import hoverHeartIcon from '../../assets/icon/hoverHeart.svg';

import selectBookmarkIcon from '../../assets/icon/selectBookmark.svg';
import selectHeartIcon from '../../assets/icon/selectHeart.svg';

import PostContent from './PostContent';

export default function PostBody({
  postData,
  onToggleLike,
  onToggleBookmark,
  likePending = false,
  bookmarkPending = false,
}) {
  const [hoverLike, setHoverLike] = useState(false);
  const [hoverBookmark, setHoverBookmark] = useState(false);

  if (!postData) return null;

  useEffect(() => {
    if (likePending) setHoverLike(false);
  }, [likePending]);

  useEffect(() => {
    if (bookmarkPending) setHoverBookmark(false);
  }, [bookmarkPending]);

  const handleLikeClick = () => {
    if (likePending) return;
    setHoverLike(false);
    onToggleLike?.();
  };

  const handleBookmarkClick = () => {
    if (bookmarkPending) return;
    setHoverBookmark(false);
    onToggleBookmark?.();
  };

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

  return (
    <>
      <PostContent html={postData.content} />

      <div className="mb-6 flex flex-wrap gap-2">
        {postData.tags?.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="rounded-lg bg-[#2A2A2A] px-3 py-1.5 text-[13px] text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mb-12 flex items-center gap-4 text-[13px] text-zinc-500">
        <button
          type="button"
          onClick={handleLikeClick}
          onMouseEnter={() => !likePending && setHoverLike(true)}
          onMouseLeave={() => setHoverLike(false)}
          disabled={likePending}
          className={[
            'flex items-center gap-1.5 hover:text-white',
            likePending ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        >
          <img src={likeIconSrc} alt="" className="h-4 w-4" />
          <span>{postData.likeCount}</span>
        </button>

        <button
          type="button"
          onClick={handleBookmarkClick}
          onMouseEnter={() => !bookmarkPending && setHoverBookmark(true)}
          onMouseLeave={() => setHoverBookmark(false)}
          disabled={bookmarkPending}
          className={[
            'flex items-center gap-1.5 hover:text-white',
            bookmarkPending ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        >
          <img src={bookmarkIconSrc} alt="" className="h-4 w-4" />
          <span>{postData.bookmarkCount}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <img src={searchIcon} alt="" className="h-4 w-4 opacity-70" />
          <span>{postData.viewCount}</span>
        </div>
      </div>
    </>
  );
}
