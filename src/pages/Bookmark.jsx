import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react';

export default function Bookmark() {
  const [keyword, setKeyword] = useState('');

  // 전체 즐겨찾기 데이터 (임시 필터링)
  const allBookmarks = timelineDummy
    .flatMap((day) => day.items)
    .filter((_, i) => i % 2 === 0);

  // 검색 결과 필터링
  const filteredItems = allBookmarks.filter((item) =>
    item.title.includes(keyword),
  );

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              즐겨찾기
            </h2>

            <div className="mt-[36px]">
              <SearchInput
                initialValue={keyword}
                onSearch={(kw) => setKeyword(kw)}
              />
            </div>

            <div className="mt-[48px]">
              {keyword ? (
                <>
                  <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {filteredItems.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                  {allBookmarks.map((item) => (
                    <BaseCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
