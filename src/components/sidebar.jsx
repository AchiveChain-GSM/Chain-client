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

function SidebarItem({ label, icon, to, collapsed, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex w-full items-center gap-[10px]',
          'h-[40px]',
          collapsed ? 'px-[10px] justify-center' : 'px-[14px]',
          'rounded-lg',
          'text-[13px] font-light transition-colors',
          isActive ? 'bg-select text-white' : 'hover:bg-hover text-white',
        ].join(' ')
      }
    >
      <img src={icon} alt={label} className="h-[14px] w-[14px] shrink-0" />
      {!collapsed && (
        <span className="min-w-0 truncate leading-none">{label}</span>
      )}
    </NavLink>
  );
}

function AddButton({ to, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex w-full items-center gap-[10px]',
          'h-[40px]',
          collapsed ? 'px-[10px] justify-center' : 'px-[14px]',
          'rounded-lg transition-colors',
          'text-[13px] font-light  text-black',
          isActive ? 'bg-[#FFFFFF1A]' : 'bg-white',
        ].join(' ')
      }
    >
      <img src={plusIcon} alt="자료추가" className="h-[14px] w-[14px] shrink-0" />
      {!collapsed && <span className="min-w-0 truncate">자료 추가</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const collapsed = false;

  return (
    <aside
      className={[
        'bg-bg h-full rounded-tr-lg py-4',
        collapsed ? 'w-[59px]' : 'w-[193px]', 
      ].join(' ')}
    >
      <nav
        className={[
          'flex flex-col gap-[10px]',
          collapsed ? 'px-[10px]' : 'px-[20px]',
        ].join(' ')}
      >
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            to={item.path}
            collapsed={collapsed}
            end={item.path === '/'}
          />
        ))}

        <AddButton to="/upload" collapsed={collapsed} />
      </nav>
    </aside>
  );
}
