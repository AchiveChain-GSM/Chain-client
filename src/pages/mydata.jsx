import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react';
// ✅ 아이콘 import 추가
import FilterIcon from '../assets/icon/filter.svg';

export default function MyData() {
  const [keyword, setKeyword] = useState('');

  // 데이터 안전하게 합치기 및 검색 필터링
  const myItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const filtered = myItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* ✅ 커스텀 스크롤바 적용 (#2B2B2B, 10px) */}
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
                내 자료
              </h2>

              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            {/* ✅ 검색창 아래 간격 36.5px */}
            <div className="mt-[36.5px]">
              {/* ✅ 필터 아이콘 라인 (상시 노출, 우측 끝에서 58px) */}
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
                {/* ✅ 그리드 규격 타 페이지와 통일 (xl:grid-cols-5) */}
                <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {filtered.length === 0 ? (
                    <div className="col-span-full mt-[60px] text-center text-zinc-600">
                      자료가 존재하지 않습니다
                    </div>
                  ) : (
                    filtered.map((item) => (
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
