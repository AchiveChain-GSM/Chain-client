const Layout = ({ children }) => {
  return (
    <div className="font-pretendard flex h-screen w-full flex-col overflow-hidden bg-[#0F0F0F] text-white">
      <TopBar />

      {/* 탑바(60~72px) + 디자인 간격(60px) = 총 120px ~ 132px 
         화면 크기에 따라 pt 값을 유동적으로 조절합니다.
      */}
      <div className="flex flex-1 overflow-hidden pt-[120px] md:pt-[132px]">
        <aside className="w-[234px] shrink-0 border-r border-[#2F3233]">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
