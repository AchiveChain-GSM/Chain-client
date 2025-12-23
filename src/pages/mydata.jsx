import React, { useState } from 'react';
import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard';
import SearchInput from '../components/Search/SearchInput';
import FilterModal from '../components/FilterModal'; // 필터 모달 추가
import { timelineDummy } from '../data/timelinedummy';
import FilterIcon from '../assets/icon/filter.svg';

export default function MyData() {
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); //  모달 상태 추가

  // 데이터 안전하게 합치기 및 검색 필터링
  const myItems = timelineDummy?.flatMap((day) => day.items || []) || [];
  const filtered = myItems.filter((item) =>
    item.title?.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <Layout>
      {/* relative: 모달 위치의 기준점 */}
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
                내 자료
              </h2>
              <div className="mt-[36px]">
                <SearchInput onSearch={(kw) => setKeyword(kw)} />
              </div>
            </div>

            <div className="mt-[36.5px]">
              {/*  즐겨찾기와 마찬가지로 필터 버튼 상시 노출 */}
              <div className="mb-[36px] flex items-center justify-between pr-[58px] pl-[32px]">
                <h3 className="text-[24px] font-semibold text-white">
                  {keyword ? `“${keyword}” 검색결과` : ''}
                </h3>

                {/* 필터 버튼: 아이콘 24px로 축소 적용 */}
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)} // 모달 토글
                  className="z-10 flex items-center justify-center p-1 transition-opacity hover:opacity-70"
                >
                  <img
                    src={FilterIcon}
                    alt="filter"
                    className="h-[24px] w-[24px]" //  24px로 조정
                  />
                </button>
              </div>

              <div className="px-[32px]">
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

        {/* 외부 클릭 시 닫기 레이어 및 필터 모달 */}
        {isModalOpen && (
          <>
            {/* 투명 백드롭 (z-40) */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsModalOpen(false)}
            />

            {/* 필터 모달 (z-50): 위치 일관성 유지 */}
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
