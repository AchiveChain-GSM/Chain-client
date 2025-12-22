import React, { useState } from 'react';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';

export default function Search() {
  const [keyword, setKeyword] = useState('');

  // 1. 데이터 안전하게 합치기
  const allItems = timelineDummy?.flatMap((day) => day.items || []) || [];

  // 2. 검색어 필터링 로직
  const searchResults = allItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full flex-col px-[32px] pt-[48px]">
        <h2 className="text-[40px] font-bold tracking-tight text-white">
          자료 검색
        </h2>

        <div className="mt-[36px]">
          <SearchInput onSearch={(kw) => setKeyword(kw)} />
        </div>

        <div className="mt-[48px] flex-1">
          {/* ✅ keyword가 있을 때만 검색 결과를 보여줌 */}
          {keyword ? (
            <div className="flex flex-col">
              <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                “{keyword}” 검색결과
              </h3>

              {searchResults.length === 0 ? (
                <div className="mt-[60px] text-center text-zinc-600">
                  일치하는 결과가 없습니다.
                </div>
              ) : (
                /* ✅ 28px 간격 및 정렬 유지 */
                <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:grid-cols-6">
                  {searchResults.map((item) => (
                    <BaseCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          ) : /* ✅ 검색어가 없을 때는 아무것도 뜨지 않음 (시안 반영) */
          null}
        </div>
        <div className="h-[80px]" />
      </div>
    </Layout>
  );
}
