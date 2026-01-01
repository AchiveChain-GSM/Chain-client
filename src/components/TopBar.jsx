import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo/logo-vertical-symbol.svg';
import peopleShape from '../assets/peopleShape.svg';
import xIcon from '../assets/uploadIcon/x.svg';
import afterIcon from '../assets/uploadIcon/after.svg';

const TopBar = () => {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteName, setDeleteName] = useState('');

  const [user, setUser] = useState({
    name: '',
    details: '',
    email: '',
    isProfileRegistered: false, // ✅ 프로필 등록 여부
  });

  const getToken = () =>
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    '';

  // ✅ accessToken이 sessionStorage에 있으면 "현재 로그인 저장소"를 session으로 간주
  const getActiveStorage = () => {
    return sessionStorage.getItem('accessToken') ? sessionStorage : localStorage;
  };

  const decodeJwtPayload = (token) => {
    try {
      if (!token) return null;
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  const loadMe = () => {
    const token = getToken();
    const payload = decodeJwtPayload(token);
    const email = payload?.sub || '';

    const store = getActiveStorage();

    let profile = null;
    if (email) {
      // ✅ 현재 로그인 저장소(session/local) 우선, 없으면 반대쪽도 fallback
      const cached =
        store.getItem(`profile:${email}`) ||
        localStorage.getItem(`profile:${email}`) ||
        sessionStorage.getItem(`profile:${email}`);

      if (cached) {
        try {
          profile = JSON.parse(cached);
        } catch {
          profile = null;
        }
      }
    }

    const nameRaw = profile?.userName || payload?.userName || '';
    const gen = profile?.generation || payload?.generation || '';
    const cls = profile?.userClass || payload?.userClass || '';
    const num = profile?.userNumber || payload?.userNumber || '';

    const fallbackName = email ? String(email).split('@')[0] : '';
    const displayName = nameRaw || fallbackName;

    const hasClassInfo = Boolean(gen || cls || num);
    const details = hasClassInfo
      ? `${gen}기 ${cls}반 ${num}번`
      : email
        ? '학생 정보 미등록'
        : '정보 없음';

    const isProfileRegistered = Boolean(
      (profile?.userName && profile?.generation && profile?.userClass && profile?.userNumber) ||
        (nameRaw && gen && cls && num),
    );

    setUser({
      name: displayName,
      email,
      details,
      isProfileRegistered,
    });
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAuthStorage = () => {
    // ✅ 토큰만 제거 (프로필 캐시는 계정별로 남겨둬도 괜찮습니다)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    // ✅ 공용키(예전 방식) 혹시 남아있으면 정리
    ['email', 'userName', 'generation', 'userClass', 'userNumber'].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteName('');
  };

  const handleWithdrawal = () => {
    // 실제 탈퇴 API가 없다면, 프론트만으로는 “로그아웃 + 캐시 정리” 수준입니다.
    if (deleteName === user.name && user.name !== '') {
      alert('회원탈퇴가 완료되었습니다.');
      clearAuthStorage();
      navigate('/login');
    }
  };

  const profileModalStyle = useMemo(
    () => ({
      position: 'absolute',
      top: '60px',
      right: '0',
      width: '234px',
      backgroundColor: '#1D1D1D',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      zIndex: 1001,
    }),
    [],
  );

  return (
    <>
      <nav className="fixed top-0 left-0 z-[1000] flex h-[60px] w-full items-center border-b border-[#2F3233] bg-[#1D1D1D] px-[20px] md:h-[72px] md:px-[48px]">
        <div className="relative mx-auto flex w-full max-w-[1920px] items-center justify-between">
          <div
            className="flex cursor-pointer items-center gap-[8px]"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Logo" className="h-[20px] md:h-[24px]" />
            <span className="text-[10px] font-light text-white uppercase md:text-[12px]">
              ARCHIVE. CHAIN
            </span>
          </div>

          <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}>
            <img src={peopleShape} alt="Profile" className="h-[24px] w-[24px]" />
          </button>

          {isProfileModalOpen && (
            <div style={profileModalStyle}>
              <div className="text-left">
                <div className="mb-[8px] text-[20px] font-semibold text-white">
                  {user.name || '사용자'}
                </div>
                <div className="text-[16px] text-[#E2E2E2]">{user.details}</div>
                {user.email ? (
                  <div className="mt-[6px] text-[13px] text-zinc-400">{user.email}</div>
                ) : null}
              </div>

             

              <button
                className="mt-[24px] flex h-[48px] items-center justify-center gap-[8px] rounded-[8px] border border-white bg-transparent text-[16px] text-white"
                onClick={() => {
                  clearAuthStorage();
                  navigate('/login');
                }}
                type="button"
              >
                로그아웃
                <img src={afterIcon} alt="arrow" className="h-auto w-[18px]" />
              </button>

              
            </div>
          )}
        </div>
      </nav>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60">
          <div className="relative flex h-[384px] w-[894px] flex-col items-center rounded-[12px] bg-[#1D1D1D] px-[24px] py-[36px]">
            <button
              className="absolute top-[32px] right-[32px] flex items-center justify-center"
              onClick={handleCloseDeleteModal}
              type="button"
            >
              <img src={xIcon} alt="Close" style={{ width: '24px', height: '14px' }} />
            </button>

            <div className="text-[20px] font-medium text-white">회원탈퇴</div>

            <div className="mt-[64px] text-center text-[16px] leading-[1.5] text-white">
              정말 회원을 탈퇴하실건가요?
              <br />
              탈퇴하시려면 이름을 적어주세요
            </div>

            <input
              type="text"
              placeholder="계정 소유주의 이름 입력"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
              className="mt-[16px] h-[48px] w-[846px] rounded-[8px] border-none bg-[#191919] text-center text-[16px] text-white outline-none placeholder:text-[#4E4E4E]"
            />

            <button
              disabled={deleteName !== user.name || deleteName === ''}
              onClick={handleWithdrawal}
              className={`mt-[64px] h-[48px] w-[846px] rounded-[8px] text-[16px] font-medium transition-colors ${
                deleteName === user.name && deleteName !== ''
                  ? 'cursor-pointer bg-white text-black'
                  : 'cursor-not-allowed bg-[#4E4E4E] text-[#1D1D1D]'
              }`}
              type="button"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      )}

      {(isProfileModalOpen || isDeleteModalOpen) && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={() => {
            setIsProfileModalOpen(false);
            if (!isDeleteModalOpen) handleCloseDeleteModal();
          }}
        />
      )}
    </>
  );
};

export default TopBar;
