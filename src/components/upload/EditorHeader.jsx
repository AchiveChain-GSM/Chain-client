import { useNavigate } from 'react-router-dom';
import beforeIcon from '../../assets/uploadIcon/before.svg';
import uploadIcon from '../../assets/uploadIcon/upload.svg';

export default function EditorHeader({ title, setTitle, onPublish, isSubmitting }) {
  const nav = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex items-center gap-2 text-sm text-white transition-colors hover:text-white/80"
        >
          <img src={beforeIcon} alt="이전으로" className="h-4 w-4" />
          <span>이전으로</span>
        </button>

        <button
          onClick={onPublish}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <img src={uploadIcon} alt="게시하기" className="h-3 w-3" />
          {isSubmitting ? '업로드 중...' : '게시하기'}
        </button>
      </div>

      <input
        type="text"
        placeholder="제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent p-4 pt-6 pb-2 text-[38px] font-semibold text-white outline-none placeholder-[#444444]"
      />
    </>
  );
}
