import peopleShape from '../../assets/peopleShape.svg';
import beforeIcon from '../../assets/uploadIcon/before.svg';
import detailIcon from '../../assets/icon/detail.svg';
import sirenIcon from '../../assets/icon/siren.svg';
import deleteIcon from '../../assets/icon/del.svg';
import fileIcon from '../../assets/icon/file.svg';

import { getTimeAgo, formatKoreanDate } from './timeAgo';

export default function PostHeader({
  postData,
  isOwner,
  isMenuOpen,
  setIsMenuOpen,
  onBack,
  onEdit,
  onDelete,
  onReport,
  currentUser,
}) {
  const authorName = postData.author?.name ?? '작성자';
  const isMe = postData.author?.userId && currentUser?.userId
    ? postData.author.userId === currentUser.userId
    : authorName === (currentUser?.name ?? '');

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <img src={beforeIcon} alt="뒤로가기" className="h-4 w-4 opacity-60" />
        <span>이전으로</span>
      </button>

      <div className="flex items-start justify-between">
        <h1 className="mb-4 text-[40px] font-bold text-white">{postData.title}</h1>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-zinc-500 hover:text-white"
            type="button"
          >
            <img src={detailIcon} alt="" className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute top-8 right-0 z-50 w-32 rounded-lg bg-[#2A2A2A] p-2">
              {isOwner ? (
                <>
                  <button
                    onClick={onEdit}
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-hover"
                  >
                    <img src={fileIcon} alt="" />
                    자료 수정
                  </button>

                  <button
                    onClick={onDelete}
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-hover"
                  >
                    <img src={deleteIcon} alt="" />
                    자료 삭제
                  </button>
                </>
              ) : (
                <button
                  onClick={onReport}
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-hover"
                >
                  <img src={sirenIcon} alt="" className="h-4 w-4" />
                  신고하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <img src={peopleShape} alt="프로필" className="h-5 w-5 opacity-80" />

        <span className="text-[15px] font-medium text-[#888888]">
          {authorName}
          {isMe && <span className="ml-1 text-xs font-normal text-zinc-600">나</span>}
        </span>

        <span className="text-[14px] text-[#888888]">
          {formatKoreanDate(postData.createdAt)}
        </span>

        <span className="text-[14px] text-[#888888]">
          {getTimeAgo(postData.createdAt)}
        </span>
      </div>
    </>
  );
}
