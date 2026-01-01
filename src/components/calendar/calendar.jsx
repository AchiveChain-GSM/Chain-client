import { useMemo, useRef, useState, useEffect } from 'react';
import CalendarHeader from './calendarHeader';
import CalendarMonth from './calendarMonth';
import { getTimelinePosts } from '../../api/posts';

export default function Calendar({ onDateChange, onSelectDays }) {
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

  // ✅ API 연동: 게시물이 존재하는 날짜들(캘린더 점 표시용)
  const [postExistedDays, setPostExistedDays] = useState([]);
  const [daysLoading, setDaysLoading] = useState(false);

  // 날짜 변경 시 부모(Timeline)에게 알림 (월 변경)
  useEffect(() => {
    if (onDateChange) {
      const newDate = new Date(selected.year, selected.month - 1, 1);
      onDateChange(newDate);
    }
  }, [selected.year, selected.month]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ 캘린더에 찍을 '게시물 존재 날짜'를 한 번에 가져오기
  useEffect(() => {
    let alive = true;

    const fetchDays = async () => {
      try {
        setDaysLoading(true);

        // 표시 범위: endYear-01-01 00:00:00 ~ startYear-startMonth-말일 23:59:59
        const rangeFrom = `${endYear}-01-01T00:00:00Z`;

        const lastDay = new Date(startYear, startMonth, 0).getDate();
        const mm = String(startMonth).padStart(2, '0');
        const dd = String(lastDay).padStart(2, '0');
        const rangeTo = `${startYear}-${mm}-${dd}T23:59:59Z`;

        // ✅ 백엔드: POST /api/posts/timeline -> Page<PostReadRes>
        // getTimelinePosts는 res.data 그대로 반환하므로, Page면 content를 꺼내야 함
        const res = await getTimelinePosts({
          from: rangeFrom,
          to: rangeTo,
          page: 0,
          size: 500, // 충분히 크게 (필요시 조정)
        });

        const posts = Array.isArray(res) ? res : (res?.content ?? []);

        // ✅ 중복 제거 + year/month/day 추출
        const uniq = new Set();
        const days = [];

        for (const p of posts) {
          const dateStr = p?.createdAt ?? p?.createAt ?? p?.create_at;
          if (!dateStr) continue;

          const d = new Date(dateStr);
          if (Number.isNaN(d.getTime())) continue;

          const y = d.getFullYear();
          const m = d.getMonth() + 1;
          const day = d.getDate();

          const key = `${y}-${m}-${day}`;
          if (uniq.has(key)) continue;

          uniq.add(key);
          days.push({ year: y, month: m, day });
        }

        if (alive) setPostExistedDays(days);
      } catch (e) {
        console.error('캘린더 게시물 날짜 로딩 실패:', e);
        if (alive) setPostExistedDays([]);
      } finally {
        if (alive) setDaysLoading(false);
      }
    };

    fetchDays();
    return () => {
      alive = false;
    };
  }, [startYear, startMonth, endYear]);

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
    const rootEl = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setViewYear(Number(e.target.dataset.year));
        });
      },
      { root: rootEl, rootMargin: '-50% 0px -50% 0px' },
    );

    Object.values(yearRefs.current).forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [calendarData]);

  return (
    <aside className="bg-bg flex h-full w-[390px] flex-col overflow-hidden rounded-lg">
      <CalendarHeader year={viewYear} />

      {daysLoading && (
        <div className="px-6 pb-2 text-[12px] text-zinc-500">
          달력 데이터를 불러오는 중...
        </div>
      )}

      <div
        ref={containerRef}
        className="custom-scrollbar mr-[24px] ml-[12px] flex-1 overflow-y-auto"
      >
        {calendarData.map((group) => (
          <div
            key={group.year}
            data-year={group.year}
            ref={(el) => (yearRefs.current[group.year] = el)}
            className="mb-4 flex flex-col gap-4"
          >
            {group.months.map(({ year, month }) => (
              <CalendarMonth
                key={`${year}-${month}`}
                year={year}
                month={month}
                selected={selected}
                setSelected={setSelected}
                postExistedDays={postExistedDays}
                onSelectDays={onSelectDays}
                onSelectDay={onDateChange}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
