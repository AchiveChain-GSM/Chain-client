import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react';
// ✅ 아이콘 import 추가
import FilterIcon from '../assets/icon/filter.svg';

export default function Recent() {
  const [keyword, setKeyword] = useState('');

  const allItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const searchResults = allItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* ✅ 스크롤바 스타일 통일 (#2B2B2B, 10px) */}
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
                최근 본 자료
              </h2>

              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            {/* ✅ 검색창 아래 간격 36.5px 고정 */}
            <div className="mt-[36.5px]">
              {/* ✅ 필터 아이콘 라인 (항상 노출, 오른쪽 끝에서 58px) */}
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
                {keyword ? (
                  <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {searchResults.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  timelineDummy.map((day) => (
                    <div key={day.date} className="mb-[60px]">
                      <h3 className="mb-[24px] text-[18px] font-semibold text-zinc-400">
                        {day.date}
                      </h3>
                      <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                        {day.items.map((item) => (
                          <BaseCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
