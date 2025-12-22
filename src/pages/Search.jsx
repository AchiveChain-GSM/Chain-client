import React, { useState } from 'react';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal';
import { timelineDummy } from '../data/timelinedummy';
import FilterIcon from '../assets/icon/filter.svg';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const searchResults = allItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      {/* relative 컨테이너: 모달 위치의 기준점 */}
      <div className="relative flex h-full px-[24px] pb-[24px]">
        {/* 우측 콘텐츠 박스 */}
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
                자료 검색
              </h2>
              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="mt-[36.5px]">
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : ''}
                </h3>

                {/* 필터 버튼: 클릭 시 모달 토글 */}
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

        {/* ✅ 외부 클릭 시 닫기 및 모달 레이아웃 */}
        {isModalOpen && (
          <>
            {/* 배경 클릭 감지용 투명 레이어 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsModalOpen(false)}
            />

            {/* 실제 모달창: FilterModal 컴포넌트 사용 */}
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
