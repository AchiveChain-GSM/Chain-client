import TopBar from '../components/topbar';
import Sidebar from '../components/sidebar';
import { SearchInput } from '../components/Search';

export default function Search() {
  return (
    <div className="min-h-screen w-full bg-[#0F0F0F] text-white">
      <TopBar />

      <div className="flex h-[calc(100vh-44px)] gap-4 p-4">
        <div className="w-56 shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 rounded-xl bg-[#1D1D1D] p-6">
          <h1 className="mb-6 text-xl font-semibold">자료 검색</h1>
          <SearchInput />
        </main>
      </div>
    </div>
  );
}
