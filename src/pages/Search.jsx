import Layout from '../components/Layout';
import SearchInput from '../components/Search/SearchInput';
import BaseCard from '../components/BaseCard';
import { useState } from 'react';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [hasResult, setHasResult] = useState(true);

  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              자료 검색
            </h2>

            <div className="mt-[36px]">
              <SearchInput
                initialValue={keyword}
                onSearch={(kw) => setKeyword(kw)}
              />
            </div>

            {keyword && (
              <div className="mt-[48px]">
                <div className="mb-[36px] flex items-center justify-between">
                  <h3 className="text-[24px] font-semibold text-white">
                    “{keyword}” 검색결과
                  </h3>
                  <button className="text-zinc-500 transition-colors hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="21" x2="4" y2="14"></line>
                      <line x1="4" y1="10" x2="4" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="3"></line>
                      <line x1="20" y1="21" x2="20" y2="16"></line>
                      <line x1="20" y1="12" x2="20" y2="3"></line>
                      <line x1="2" y1="14" x2="6" y2="14"></line>
                      <line x1="10" y1="8" x2="14" y2="8"></line>
                      <line x1="18" y1="16" x2="22" y2="16"></line>
                    </svg>
                  </button>
                </div>

                {!hasResult ? (
                  <div className="mt-[100px] text-center text-[18px] text-zinc-500">
                    검색 결과가 존재하지 않습니다.
                  </div>
                ) : (
                  /* ✅ 2xl:grid-cols-6으로 수정 완료! */
                  <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <BaseCard
                        key={item}
                        item={{
                          title: '검색된 자료 제목',
                          author: '작성자 이름',
                          description:
                            '검색 결과에 대한 간단한 설명입니다. 두 줄까지 표시됩니다.',
                          likes: 12,
                          bookmarks: 16,
                          views: 16,
                          tags: ['태그1', '태그2'],
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
