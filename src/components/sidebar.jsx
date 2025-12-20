import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import timelineIcon from '../assets/icon/timeline.svg';
import searchIcon from '../assets/icon/search.svg';
import recentIcon from '../assets/icon/recent.svg';
import bookmarkIcon from '../assets/icon/bookmark.svg';
import myIcon from '../assets/icon/my.svg';
import plusIcon from '../assets/icon/plus.svg';

const sidebarItems = [
  { id: 'timeline', label: '타임라인', icon: timelineIcon, path: '/' },
  { id: 'search', label: '자료 검색', icon: searchIcon, path: '/search' },
  { id: 'recent', label: '최근 본 자료', icon: recentIcon, path: '/recent' },
  { id: 'bookmark', label: '즐겨찾기', icon: bookmarkIcon, path: '/bookmark' },
  { id: 'mydata', label: '내 자료', icon: myIcon, path: '/mydata' },
];

function SidebarItem({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3',
        'h-12 px-4 py-3',
        'rounded-lg',
        'text-base transition-colors font-light',
        active ? 'bg-select text-white' : 'hover:bg-hover text-white',
      ].join(' ')}
    >
      <img src={icon} alt={label} className="h-4 w-4 shrink-0" />
      <span className="leading-none">{label}</span>
    </button>
  );
}

function AddButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex h-12 w-full items-center gap-3 rounded-lg px-4 py-3 text-base transition-colors text-black font-light',
        active ? 'bg-[#FFFFFF1A]' : 'bg-white',
      ].join(' ')}
    >
      <img src={plusIcon} alt="자료추가" />
      <span>자료 추가</span>
    </button>
  );
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState('timeline');
  const navigate = useNavigate();

  return (
    <aside className="bg-bg w-[234px] h-full rounded-tr-lg py-4">
      <nav className="flex flex-col gap-3 px-6">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={activeId === item.id}
            onClick={() => {
              setActiveId(item.id);
              navigate(item.path);
            }}
          />
        ))}

        <AddButton
          active={activeId === 'upload'}  
          onClick={() => {
            setActiveId('upload'); 
            navigate('/upload'); 
          }}
        />
      </nav>
    </aside>
  );
}
