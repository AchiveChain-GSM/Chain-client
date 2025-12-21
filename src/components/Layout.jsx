import TopBar from './topbar';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0F0F0F] text-white">
      {/* 1. 탑바: 여기서 높이를 한 번만 정의합니다 (54px) */}
      <TopBar />

      {/* 2. 메인 영역: 탑바 높이만큼 뺀 나머지 전체를 차지함 */}
      <div className="flex flex-1 overflow-hidden pt-[45px]">
        {/* 사이드바 영역: 0.75배 수치 적용 */}
        <aside className="w-[234px] shrink-0">
          <Sidebar />
        </aside>

        {/* 페이지별 실제 콘텐츠가 들어가는 곳 */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
