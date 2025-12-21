import { useNavigate } from 'react-router-dom';
import beforeIcon from '../../assets/uploadIcon/before.svg';

export default function EditorHeader({ title, setTitle }) {
  const nav = useNavigate();

  const handleGoBack = () => {
    nav(-1); 
  };

  return (
    <>
      <div className="p-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm text-white"
        >
          <img src={beforeIcon} alt="이전으로" className="h-4 w-4" />
          <span>이전으로</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent p-4 pt-6 pb-2 text-[38px] placeholder-[#444444] font-semibold text-white outline-none"
      />
    </>
  );
}