import Layout from '../components/Layout';
import TimelineCard from '../components/TimelineCard';
import Calendar from '../components/calendar/calendar';
import SearchInput from '../components/Search/SearchInput';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTimelinePosts } from '../api/posts';

function toMonthRangeISO(dateLike) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const mm = String(month).padStart(2, '0');

  const lastDay = new Date(year, month, 0).getDate();
  const ddLast = String(lastDay).padStart(2, '0');

  return {
    from: `${year}-${mm}-01T00:00:00Z`,
    to: `${year}-${mm}-${ddLast}T23:59:59Z`,
    year,
    month,
  };
}

export default function Timeline() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Calendar가 무엇을 주든 Date로 맞추기
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDaysState, setSelectedDaysState] = useState(null); // Date | null

  useEffect(() => {
    const fetchTimeline = async () => {
      const range = toMonthRangeISO(currentDate);
      if (!range) {
        console.error('currentDate 파싱 실패:', currentDate);
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getTimelinePosts({
          from: range.from,
          to: range.to,
          size: 200,
          page: 0,
        });

        setPosts(data?.content ?? []);
      } catch (error) {
        console.error(
          '타임라인 로딩 에러:',
          error?.response?.status,
          error?.response?.data ?? error,
        );
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [currentDate]);

  function toYmdLocal(input) {
    if (!input) return null;
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return null;

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function ymdFromYMD(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  // ✅ 날짜(yyyy-mm-dd) 기반 그룹핑 (정렬 포함)
  function groupByDateYmd(list) {
    const map = list.reduce((acc, post) => {
      const created = post?.createdAt ?? post?.createAt ?? post?.create_at;
      const ymd = toYmdLocal(created);
      if (!ymd) return acc;

      if (!acc[ymd]) acc[ymd] = [];
      acc[ymd].push(post);
      return acc;
    }, {});

    // 날짜 내 정렬(최신순)
    Object.keys(map).forEach((ymd) => {
      map[ymd].sort((a, b) => {
        const da = new Date(a?.createdAt ?? a?.createAt ?? a?.create_at);
        const db = new Date(b?.createdAt ?? b?.createAt ?? b?.create_at);
        return db - da;
      });
    });

    // 날짜 그룹 정렬(최신 날짜가 위)
    return Object.entries(map).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }

  // ✅ 라벨: "12월 18일"
  function ymdToLabel(ymd) {
    if (!ymd) return '';
    const [y, m, d] = ymd.split('-').map(Number);
    if (!y || !m || !d) return ymd;
    return `${m}월 ${d}일`;
  }

  const shown = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = posts;

    // ✅ 여러 날짜 선택 필터
    const sel = selectedDaysState;
    if (
      sel?.year &&
      sel?.month &&
      Array.isArray(sel.days) &&
      sel.days.length > 0
    ) {
      const allowed = new Set(
        sel.days.map((day) => ymdFromYMD(sel.year, sel.month, day)),
      );

      list = list.filter((p) => {
        const created = p?.createdAt ?? p?.createAt ?? p?.create_at;
        const ymd = toYmdLocal(created);
        return ymd && allowed.has(ymd);
      });
    }

    // ✅ 검색 필터
    if (!kw) return list;
    return list.filter((p) => (p.title ?? '').toLowerCase().includes(kw));
  }, [posts, keyword, selectedDaysState]);

  // ✅ 날짜별 그룹(렌더용)
  const grouped = useMemo(() => groupByDateYmd(shown), [shown]);

  const monthLabel = useMemo(() => {
    const d = currentDate instanceof Date ? currentDate : new Date(currentDate);
    return Number.isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}월`;
  }, [currentDate]);

  return (
    <Layout>
      <div className="flex h-full gap-[24px] px-[24px] pb-[24px]">
        {/* 캘린더 영역 */}
        <div className="scrollbar-hide w-[390px] shrink-0 overflow-y-auto">
          <Calendar
            onDateChange={(value) => {
              const next = value instanceof Date ? value : new Date(value);
              setCurrentDate(next);
            }}
            onSelectDays={(sel) => setSelectedDaysState(sel)}
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden rounded-lg bg-[#1D1D1D]">
          <div className="custom-scrollbar h-full overflow-y-auto px-[32px] pt-[48px]">
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

            <h2 className="text-[40px] font-bold tracking-tight text-white">
              {monthLabel}
            </h2>

            <div className="mt-[36px]">
              <SearchInput onSearch={(kw) => setKeyword(kw)} />
            </div>

            <div className="mt-[36px] flex flex-col">
              {loading ? (
                <div className="mt-[60px] text-center text-[14px] text-zinc-500">
                  데이터를 불러오는 중...
                </div>
              ) : (
                <div className="mt-[12px]">
                  {keyword && (
                    <h3 className="mb-[36px] text-[24px] font-semibold text-white">
                      “{keyword}” 검색결과
                    </h3>
                  )}

                  {/* ✅ 날짜별 섹션 렌더 */}
                  {grouped.map(([ymd, items]) => (
                    <div key={ymd} className="mb-[48px]">
                      <h3 className="mb-[24px] text-[20px] font-semibold text-white">
                        {ymdToLabel(ymd)}
                      </h3>

                      <div className="grid grid-cols-1 gap-[36px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {items.map((item) => (
                          <TimelineCard
                            key={item.postId}
                            item={item}
                            onClick={() =>
                              navigate(`/posts/${item.postId}`, {
                                state: { post: item },
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {!loading && grouped.length === 0 && (
                    <div className="mt-[60px] text-center text-zinc-600">
                      자료가 존재하지 않습니다.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-[80px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
