import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react';
import FilterIcon from '../assets/icon/filter.svg';

export default function Bookmark() {
  const [keyword, setKeyword] = useState('');

  // ✅ isBookmarked: true인 데이터만 필터링
  const allBookmarks =
    timelineDummy
      ?.flatMap((day) => day.items || [])
      .filter((item) => item.isBookmarked === true) || [];

  const filteredItems = allBookmarks.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* ✅ 커스텀 스크롤바 (10px, #2B2B2B) */}
          <div className="custom-scrollbar h-full overflow-y-auto pt-[48px]">
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #2b2b2b;
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #3d3d3d;
              }
            `}</style>

            <div className="px-[32px]">
              <h2 className="text-[40px] font-bold tracking-tight text-white">
                즐겨찾기
              </h2>

              <div className="mt-[36px]">
                <SearchInput
                  initialValue={keyword}
                  onSearch={(kw) => setKeyword(kw)}
                />
              </div>
            </div>

            <div className="mt-[36.5px]">
              {/* ✅ 필터 아이콘 라인 (우측 58px 간격 유지) */}
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : ''}
                </h3>

                <button className="flex items-center justify-center p-1 transition-opacity hover:opacity-70">
                  <img
                    src={FilterIcon}
                    alt="filter"
                    className="h-[28px] w-[28px]"
                  />
                </button>
              </div>

              <div className="px-[32px]">
                <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {keyword ? (
                    filteredItems.length === 0 ? (
                      <div className="col-span-full mt-[60px] text-center text-zinc-600">
                        검색 결과가 없습니다.
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <BaseCard key={item.id} item={item} />
                      ))
                    )
                  ) : allBookmarks.length === 0 ? (
                    <div className="col-span-full mt-[60px] text-center text-zinc-600">
                      즐겨찾기한 자료가 없습니다.
                    </div>
                  ) : (
                    allBookmarks.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
