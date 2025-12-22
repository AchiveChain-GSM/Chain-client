import Layout from '../components/Layout';
import SearchInput from '../components/Search/SearchInput';
import BaseCard from '../components/BaseCard';
import { useState } from 'react';
import FilterIcon from '../assets/icon/filter.svg';
// 경로 인식 오류 방지를 위해 확장자 생략 버전으로 시도
import { timelineDummy } from '../data/timelinedummy.js';

export default function Search() {
  const [keyword, setKeyword] = useState('');

  // 데이터 안전장치
  const data = timelineDummy || [];

  // 검색 로직
  const allItems = data.flatMap((day) => day.items || []);
  const searchResults = allItems.filter((item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="relative flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              자료 검색
            </h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            {keyword && (
              <div className="mt-[48px]">
                <div className="mb-[36px] flex items-center justify-between">
                  <h3 className="text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  <button className="flex items-center justify-center transition-opacity hover:opacity-70">
                    <img
                      src={FilterIcon}
                      alt="filter"
                      className="h-[16px] w-[16px]"
                    />
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="mt-[100px] text-[20px] font-medium text-zinc-500">
                    자료가 존재하지 않습니다
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[36px] pb-[100px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {searchResults.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
