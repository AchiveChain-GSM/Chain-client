import React, { useState } from 'react';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import { timelineDummy } from '../data/timelinedummy';
import FilterIcon from '../assets/icon/filter.svg';

export default function Recent() {
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const searchResults = allItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      <div className="relative flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
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

            <div className="mt-[36.5px]">
              {/* ✅ 검색어가 있을 때만 결과 타이틀과 필터 아이콘 노출 */}
              {keyword && (
                <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                  <h3 className="text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(!isModalOpen)}
                    className="z-10 flex items-center justify-center p-1 transition-opacity hover:opacity-70"
                  >
                    <img
                      src={FilterIcon}
                      alt="filter"
                      className="h-[24px] w-[24px]"
                    />
                  </button>
                </div>
              )}

              <div className="px-[32px]">
                {keyword ? (
                  /* 검색 결과 그리드 */
                  <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                    {searchResults.map((item) => (
                      <BaseCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  /* ✅ 초기 상태: "1시간 전", "12시간 전" 등 시간 섹션 노출 */
                  <div className="flex flex-col gap-[60px]">
                    {/* 예시: 1시간 전 섹션 */}
                    <section>
                      <h3 className="mb-[24px] text-[24px] font-bold text-white">
                        1시간 전
                      </h3>
                      <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                        {allItems.slice(0, 6).map((item) => (
                          <BaseCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>

                    {/* 예시: 12시간 전 섹션 */}
                    <section>
                      <h3 className="mb-[24px] text-[24px] font-bold text-white">
                        12시간 전
                      </h3>
                      <div className="grid max-w-fit grid-cols-1 gap-[28px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                        {allItems.slice(6, 12).map((item) => (
                          <BaseCard key={item.id} item={item} />
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[100px]" />
          </div>
        </div>

        {/* 필터 모달 로직 (외부 클릭 닫기 포함) */}
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <div
              className="absolute z-50 shadow-2xl"
              style={{ top: '201px', right: '72px' }}
            >
              <FilterModal />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
