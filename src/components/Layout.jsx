import TopBar from './topbar';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div className="font-pretendard flex h-screen w-full flex-col overflow-hidden bg-[#0F0F0F] text-white">
      <TopBar />
      {/* 탑바(72px) + 디자인 간격(60px) = 132px */}
      <div className="flex flex-1 overflow-hidden pt-[132px]">
        <aside className="w-[234px] shrink-0 border-r border-[#2F3233]">
          <Sidebar />
        </aside>
        {/* 본문 영역은 스크롤 없이 Layout에서 고정 */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
