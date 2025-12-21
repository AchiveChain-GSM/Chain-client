import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import Layout from '../components/Layout';
import { timelineDummy } from '../data/timelineDummy';

export default function Timeline() {
  return (
    <Layout>
      <div className="flex h-full gap-[18px] pl-[18px]">
        {/* Calendar */}
        <div className="w-[390px] shrink-0 overflow-y-auto">
          <Calendar />
        </div>

        {/* Timeline Content */}
        <section className="flex-1 overflow-hidden rounded-xl bg-[#1D1D1D]">
          <div className="h-full overflow-y-auto px-[18px] pt-[76px]">
            <h2 className="text-[28px] font-semibold">12월</h2>

            <div className="mt-[27px]">
              <SearchInput onSearch={(kw) => console.log(kw)} />
            </div>

            <div className="mt-[27px] flex flex-col gap-[27px]">
              {timelineDummy.map((day) => (
                <div key={day.date}>
                  <h3 className="mb-[18px] text-sm text-zinc-400">
                    {day.date}
                  </h3>

                  <div className="grid grid-cols-5 gap-[27px]">
                    {day.items.map((item) => (
                      <TimelineCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[36px]" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
