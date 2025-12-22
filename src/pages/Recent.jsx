import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import { timelineDummy } from '../data/timelinedummy';
import { useState } from 'react';

export default function Recent() {
  const [keyword, setKeyword] = useState('');
  const allItems = timelineDummy.flatMap((day) => day.items);
  const searchResults = allItems.filter((item) => item.title.includes(keyword));

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              최근 본 자료
            </h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[48px]">
              {keyword ? (
                <>
                  <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {searchResults.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))}
                  </div>
                </>
              ) : (
                timelineDummy.map((day) => (
                  <div key={day.date} className="mb-[60px]">
                    <h3 className="mb-[24px] text-[18px] font-semibold text-zinc-400">
                      {day.date}
                    </h3>
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                      {day.items.map((item) => (
                        <BaseCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
