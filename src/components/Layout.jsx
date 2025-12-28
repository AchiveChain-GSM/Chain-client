import TopBar from './TopBar';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div className="font-pretendard flex h-screen w-full flex-col overflow-hidden bg-[#0F0F0F] text-white">
      <TopBar />
      {/* 탑바 높이에 맞춰 pt 수치를 확인하세요! */}
      <div className="flex flex-1 overflow-hidden pt-[132px]">
        <aside className="w-[234px] shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

// 🚩 이 줄이 없거나 잘못 적혀있을 거예요. 아래처럼 꼭 고쳐주세요!
export default Layout;
