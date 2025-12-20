export default function CalendarHeader({ year, contentWidthClass = "w-[308px]" }) {
  return (
    <div className="bg-bg z-20 shrink-0 px-6 pb-6 pt-8">
      <h2 className="text-[42px] font-semibold leading-tight tracking-tight text-white">
        {year}년
      </h2>

      <div className={`mt-6 ${contentWidthClass}`}>
        <div className="flex ">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div
              key={d}
              className="flex h-[24px] w-[44px] items-center justify-center text-text1 text-[16px] font-normal"
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
