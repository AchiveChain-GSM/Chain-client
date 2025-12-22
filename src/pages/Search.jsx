import React, { useState } from 'react';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import FilterIcon from '../assets/icon/filter.svg';

export default function Search() {
  const [keyword, setKeyword] = useState('');

  const allItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const searchResults = allItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        {/* 우측 콘텐츠 박스 */}
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* ✅ 타임라인 페이지와 동일한 스크롤바 설정 적용 */}
          <div className="custom-scrollbar h-full overflow-y-auto pt-[48px]">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 10px; /* 너비 10px로 통일 */
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #2b2b2b; /* 요청하신 색상 #2B2B2B 적용 */
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #3d3d3d;
              }
            `}</style>

            <div className="px-[32px]">
              <h2 className="text-[40px] font-bold tracking-tight text-white">
                자료 검색
              </h2>

              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            {/* 검색창 아래 간격 36.5px */}
            <div className="mt-[36.5px]">
              {/* 필터 아이콘 라인: 우측 끝에서 58px 차이 */}
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : ''}
                </h3>

                {/* 필터 아이콘: 28x28 사이즈 */}
                <button className="flex items-center justify-center p-1 transition-opacity hover:opacity-70">
                  <img
                    src={FilterIcon}
                    alt="filter"
                    className="h-[28px] w-[28px]"
                  />
                </button>
              </div>

              {/* 검색 결과 카드 영역 */}
              <div className="px-[32px]">
                {keyword &&
                  (searchResults.length === 0 ? (
                    <div className="mt-[60px] text-center text-zinc-600">
                      자료가 존재하지 않습니다
                    </div>
                  ) : (
                    <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                      {searchResults.map((item) => (
                        <BaseCard key={item.id} item={item} />
                      ))}
                    </div>
                  ))}
              </div>
            </div>

            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
