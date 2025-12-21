function cn(...xs) {
  return xs.filter(Boolean).join(' ');
}

function hasPost(postExistedDays, y, m, d) {
  return postExistedDays?.some(
    (p) => p.year === y && p.month === m && p.day === d,
  );
}

export default function CalendarMonth({
  year,
  month,
  selected,
  setSelected,
  postExistedDays,
}) {
  const monthSelected = selected.year === year && selected.month === month;

  const lastDay = new Date(year, month, 0).getDate();
  const startDay = new Date(year, month - 1, 1).getDay();

  const cells = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: lastDay }, (_, i) => i + 1),
  ];

  const selectMonth = () => {
    setSelected((prev) =>
      prev.year === year && prev.month === month
        ? prev
        : { year, month, days: [] },
    );
  };

  const toggleDay = (day) => {
    setSelected((prev) => {
      if (prev.year !== year || prev.month !== month) {
        return { year, month, days: [day] };
      }

      const isSelected = prev.days.includes(day);
      const nextDays = isSelected
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];

      return { ...prev, days: nextDays };
    });
  };

  return (
    <div
      onClick={selectMonth}
      className={cn(
        'group w-fit rounded-lg mr-3 px-2.5 py-2.5 transition-colors',
        monthSelected ? 'bg-hover' : 'hover:bg-hover',
      )}
    >
      <div className="mb-2 text-lg font-semibold text-white">
        {month}월
      </div>

      <div className="grid grid-cols-[repeat(7,40px)] gap-y-[6px]">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} className="h-9 w-10" />
          ) : (
            <button
              key={`day-${day}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDay(day);
              }}
              className="flex h-[36px] w-[40px] items-center justify-center"
            >
              <div
                className={cn(
                  'flex h-[28px] w-[32px] items-center justify-center rounded-lg transition-colors',
                  monthSelected && selected.days.includes(day) && 'bg-select',
                  !(monthSelected && selected.days.includes(day)) &&
                    'hover:bg-dayHover',
                )}
              >
                <span
                  className={
                    hasPost(postExistedDays, year, month, day)
                      ? 'text-white'
                      : 'text-text1'
                  }
                >
                  {day}
                </span>
              </div>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
