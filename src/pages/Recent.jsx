import Layout from '../components/Layout';
import BaseCard from '../components/BaseCard'; // 1. 여기서 제대로 불러오고
import { timelineDummy } from '../data/timelineDummy';

export default function Recent() {
  return (
    <Layout>
      <div className="flex h-full px-[24px] pb-[24px]">
        <div className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="scrollbar-hide h-full overflow-y-auto px-[32px] pt-[48px]">
            <h2 className="text-[40px] font-bold tracking-tight text-white">
              최근 본 자료
            </h2>

            <div className="mt-[48px] flex flex-col">
              {timelineDummy.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className={dayIndex !== 0 ? 'mt-[60px]' : ''}
                >
                  <h3 className="mb-[24px] text-[18px] font-semibold text-zinc-400">
                    {day.date}
                  </h3>

                  {day.items.length === 0 ? (
                    <div className="py-10 text-sm text-zinc-600">
                      자료가 존재하지 않습니다
                    </div>
                  ) : (
                    /* 2. 여기서 TimelineCard 대신 BaseCard를 사용해야 합니다! */
                    <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                      {day.items.map((item) => (
                        <BaseCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="h-[80px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
