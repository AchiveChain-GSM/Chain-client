import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('인증 처리 중입니다...');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = params.get('token');
    const email = params.get('email');

    if (!token || !email) {
      setOk(false);
      setStatus('토큰 또는 이메일이 없습니다. 이메일 인증 링크를 다시 확인해주세요.');
      return;
    }

    // (선택) 링크에서도 도메인 검사
    if (!email.toLowerCase().endsWith('@gsm.hs.kr')) {
      setOk(false);
      setStatus('gsm.hs.kr의 도메인을 사용하는 이메일을 입력해주세요.');
      return;
    }

    (async () => {
      try {
        const res = await api.post('/api/auth/verify-email', { email, token });

        sessionStorage.setItem('signupResume', 'true');
        sessionStorage.setItem('emailVerified', 'true');
        sessionStorage.setItem('pendingEmail', email);

        setOk(true);
        setStatus(
          res?.data?.body ||
            '이메일 인증이 완료되었습니다. 회원가입을 진행해주세요.',
        );

        setTimeout(() => navigate('/signup'), 900);
      } catch (e) {
        setOk(false);
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.body ||
          e?.response?.data ||
          '인증에 실패했습니다. (만료되었거나 잘못된 토큰일 수 있어요.)';
        setStatus(typeof msg === 'string' ? msg : '인증에 실패했습니다.');
      }
    })();
  }, [params, navigate]);

  return (
    <div className="min-h-screen bg-[#191919] px-6 py-6 text-white">
      <div className="mx-auto w-full max-w-[720px] rounded-[12px] bg-[#1D1D1D] p-6">
        <h1 className="mb-3 font-['Pretendard'] text-[22px] font-normal">
          이메일 인증
        </h1>

        <p
          className={[
            "font-['Pretendard'] text-[15px] leading-[1.6]",
            ok ? 'text-[#B6F5C2]' : 'text-zinc-200',
          ].join(' ')}
        >
          {status}
        </p>

        <div className="mt-6 h-[1px] w-full bg-white/10" />

        <p className="mt-4 font-['Pretendard'] text-[13px] leading-[1.6] text-zinc-400">
          잠시 후 자동으로 회원가입 화면으로 이동합니다. 이동이 안 되면 주소창에서{' '}
          <span className="text-zinc-200">/signup</span> 으로 들어가주세요.
        </p>
      </div>
    </div>
  );
}
