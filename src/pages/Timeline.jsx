import Topbar from "../components/topbar";

export default function Timeline() {
  return (
    <div className="h-screen bg-black text-white">
      <Topbar />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-56 bg-zinc-900 p-4">
          Sidebar
        </aside>

        {/* Calendar */}
        <section className="w-80 bg-zinc-900 p-4">
          Calendar
        </section>

        {/* Timeline */}
        <main className="flex-1 overflow-y-auto p-6">
          타임라인
        </main>
      </div>
    </div>
  );
}
