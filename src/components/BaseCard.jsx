import React from 'react';
import HeartIcon from '../assets/BaseCard/cardheart.svg';
import BookmarkIcon from '../assets/BaseCard/cardbookmark.svg';
import SearchIcon from '../assets/BaseCard/cardsearch.svg';

export default function BaseCard({ item }) {
  return (
    <div className="group flex w-full flex-col text-white">
      {/* 썸네일 영역 */}
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

      {/* 텍스트 영역 */}
      <div className="mt-[12px] flex flex-col gap-[4px]">
        <h4 className="truncate text-[16px] leading-tight font-bold">
          {item?.title || '제목'}
        </h4>
        <p className="text-[14px] text-zinc-500">{item?.author || '작성자'}</p>
        <p className="mt-[4px] line-clamp-2 h-[40px] text-[14px] leading-snug text-zinc-400">
          {item?.description || '설명이 없습니다.'}
        </p>
      </div>

      {/* 태그 영역 */}
      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {(item?.tags || []).map((tag, index) => (
          <span
            key={index}
            className="rounded bg-[#2F3233] px-[8px] py-[2px] text-[12px] text-[#A1A1AA]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 하단 액션 바 (선 제거 버전) */}
      <div className="mt-[16px] flex items-center gap-[16px]">
        <div className="flex items-center gap-[4px]">
          <img
            src={HeartIcon}
            alt="likes"
            className="h-[16px] w-[16px] opacity-70"
          />
          <span className="text-[13px] text-zinc-400">{item?.likes ?? 16}</span>
        </div>
        <div className="flex items-center gap-[4px]">
          <img
            src={BookmarkIcon}
            alt="bookmarks"
            className="h-[16px] w-[16px] opacity-70"
          />
          <span className="text-[13px] text-zinc-400">
            {item?.bookmarks ?? 16}
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          <img
            src={SearchIcon}
            alt="views"
            className="h-[16px] w-[16px] opacity-70"
          />
          <span className="text-[13px] text-zinc-400">{item?.views ?? 16}</span>
        </div>
      </div>
    </div>
  );
}
