import { useNavigate } from 'react-router-dom';
import beforeIcon from '../../assets/uploadIcon/before.svg';
import uploadIcon from '../../assets/uploadIcon/upload.svg'

export default function EditorHeader({ title, setTitle, onPublish, isSubmitting }) {
  const nav = useNavigate();

  const handleGoBack = () => {
    nav(-1); 
  };

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors"
        >
          <img src={beforeIcon} alt="이전으로" className="h-4 w-4" />
          <span>이전으로</span>
        </button>

        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="bg-white hover:bg-white/80 rounded-lg px-4 py-2 text-black text-sm transition-colors flex items-center gap-2"
        >
          <img src={uploadIcon} alt='게시하기' className='w-3 h-3'/>
          {isSubmitting ? '업로드 중...' : '게시하기'}
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