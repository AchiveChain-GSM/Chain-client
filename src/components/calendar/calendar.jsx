import { useMemo, useRef, useState, useEffect } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarMonth from './calendarMonth';

const postExistedDays = [
  { year: 2025, month: 12, day: 13 },
  { year: 2025, month: 12, day: 15 },
  { year: 2025, month: 12, day: 18 },
];

export default function Calendar() {
  const now = useMemo(() => new Date(), []);
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() + 1;
  const endYear = 2024;

  const [selected, setSelected] = useState({
    year: startYear,
    month: startMonth,
    days: [],
  });

  const [viewYear, setViewYear] = useState(startYear);

  const calendarData = useMemo(() => {
    const result = [];
    let y = startYear;
    let m = startMonth;

    let group = { year: y, months: [] };

    while (y > endYear || (y === endYear && m >= 1)) {
      if (group.year !== y) {
        result.push(group);
        group = { year: y, months: [] };
      }

      group.months.push({ year: y, month: m });

      m -= 1;
      if (m < 1) {
        m = 12;
        y -= 1;
      }
    }

    result.push(group);
    return result;
  }, [startYear, startMonth, endYear]);

  const containerRef = useRef(null);
  const yearRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setViewYear(Number(e.target.dataset.year));
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '-50% 0px -50% 0px',
      },
    );

    Object.values(yearRefs.current).forEach(
      (el) => el && observer.observe(el),
    );

    return () => observer.disconnect();
  }, [calendarData]);

  return (
    <aside className="bg-bg flex h-screen w-[390px] flex-col overflow-hidden rounded-lg">
      <CalendarHeader year={viewYear} />

      <div
        ref={containerRef}
        className="custom-scrollbar mr-[24px] ml-[12px] flex-1 overflow-y-auto"
      >
        {calendarData.map((group) => (
          <div
            key={group.year}
            data-year={group.year}
            ref={(el) => (yearRefs.current[group.year] = el)}
            className="flex flex-col gap-4 mb-4"
          >
            {group.months.map(({ year, month }) => (
              <CalendarMonth
                key={`${year}-${month}`}
                year={year}
                month={month}
                selected={selected}
                setSelected={setSelected}
                postExistedDays={postExistedDays}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
