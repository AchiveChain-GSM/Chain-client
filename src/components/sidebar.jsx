import { NavLink } from 'react-router-dom';

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

function SidebarItem({ label, icon, to, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex w-full items-center gap-3',
          'h-11 px-4',
          'rounded-lg transition-colors',
          'text-[16px] font-normal text-white',
          isActive ? 'bg-select' : 'hover:bg-hover',
        ].join(' ')
      }
    >
      <img src={icon} alt={label} className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

function AddButton({ to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex w-full items-center gap-3',
          'h-11 px-4',
          'rounded-lg transition-colors',
          'text-[16px] font-normal text-black',
          isActive ? 'bg-white/10' : 'bg-white',
        ].join(' ')
      }
    >
      <img src={plusIcon} alt="자료추가" className="h-4 w-4 shrink-0" />
      <span>자료 추가</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside
      className={['h-full py-3', 'w-[234px] rounded-tr-lg', 'bg-bg'].join(' ')}
    >
      <nav className={['flex flex-col gap-2', 'px-4'].join(' ')}>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            to={item.path}
            end={item.path === '/'}
          />
        ))}

        <AddButton to="/upload" />
      </nav>
    </aside>
  );
}
