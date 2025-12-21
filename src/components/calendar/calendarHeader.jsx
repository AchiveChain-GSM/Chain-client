export default function CalendarHeader({
  year,
  contentWidthClass = "w-[300px]",
}) {
  return (
    <div className="bg-bg z-20 shrink-0 px-6 pb-5 pt-7">
      <h2 className="text-[36px] font-semibold leading-tight tracking-tight text-white">
        {year}년
      </h2>

      <div className={`mt-5 ${contentWidthClass}`}>
        <div className="flex">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div
              key={d}
              className="flex h-[22px] w-[40px] items-center justify-center text-text1 text-[14px] font-normal"
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
