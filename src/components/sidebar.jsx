import { useState } from 'react';

import timelineIcon from '../assets/icon/timeline.svg';
import searchIcon from '../assets/icon/search.svg';
import recentIcon from '../assets/icon/recent.svg';
import bookmarkIcon from '../assets/icon/bookmark.svg';
import myIcon from '../assets/icon/my.svg';
import plusIcon from '../assets/icon/plus.svg';

const sidebarItems = [
  { id: 'timeline', label: '타임라인', icon: timelineIcon },
  { id: 'search', label: '자료 검색', icon: searchIcon },
  { id: 'recent', label: '최근 본 자료', icon: recentIcon },
  { id: 'bookmark', label: '즐겨찾기', icon: bookmarkIcon },
  { id: 'my', label: '내 자료', icon: myIcon },
];

function SidebarItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3',
        'h-12 px-4 py-3',
        'rounded-lg',
        'text-sm transition-colors',
        active ? 'bg-[#2A2A2A] text-white' : 'text-white hover:bg-[#2A2A2A]',
      ].join(' ')}
    >
      <img src={icon} alt={label} className="h-4 w-4 shrink-0" />
      <span className="leading-none">{label}</span>
    </button>
  );
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm text-black"
    >
      <img src={plusIcon} alt="자료 추가" className="h-4 w-4" />
      <span className="font-medium">자료 추가</span>
    </button>
  );
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState('timeline');

  return (
    <aside className="h-full w-60 shrink-0 rounded-xl bg-[#1D1D1D] py-4">
      <nav className="flex flex-col gap-3 px-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={activeId === item.id}
            onClick={() => setActiveId(item.id)}
          />
        ))}

        {/* 자료 추가 버튼 */}
        <AddButton />
      </nav>
    </aside>
  );
}
