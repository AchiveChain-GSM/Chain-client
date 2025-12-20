import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard'; // 이름 바꾼 기본 카드!
import { timelineDummy } from '../data/timelineDummy';

export default function Bookmark() {
  // 테스트용으로 더미 데이터에서 아이템들만 추출 (실제로는 즐겨찾기된 데이터만 필터링하게 될 거예요)
  const bookmarkItems = timelineDummy
    .flatMap((day) => day.items)
    .filter((_, index) => index % 2 === 0);

  return (
    <Layout>
      {/* 캘린더 없이 본문 보드만 배치하여 넓게 사용 */}
      <div className="flex h-full px-[24px] pb-[24px]">
        {/* 메인 보드 영역 */}
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          {/* 타임라인과 동일한 상단 여백 pt-[48px], 좌우 px-[32px] */}
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            {/* 페이지 제목: 즐겨찾기 */}
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              즐겨찾기
            </h2>

            {/* 카드 리스트 영역 (mt-48px로 제목과 간격 유지) */}
            <div className="mt-[48px]">
              {bookmarkItems.length === 0 ? (
                /* 데이터가 없을 때의 처리 */
                <div className="mt-[100px] text-center text-[18px] text-zinc-600">
                  즐겨찾기한 자료가 없습니다.
                </div>
              ) : (
                /* 그리드 시스템: 카드 사이 간격 36px 유지 */
                /* 넓어진 보드에 맞춰 2xl에서는 6열까지 확장 */
                <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                  {bookmarkItems.map((item) => (
                    <BaseCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* 하단 여백: 스크롤 끝 여유분 */}
            <div className="h-[100px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
