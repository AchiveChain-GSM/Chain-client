// src/components/postDetail/PostHeader.jsx
import peopleShape from '../../assets/peopleShape.svg';
import beforeIcon from '../../assets/uploadIcon/before.svg';
import detailIcon from '../../assets/icon/detail.svg';
import sirenIcon from '../../assets/icon/siren.svg';
import deleteIcon from '../../assets/icon/del.svg';
import fileIcon from '../../assets/icon/file.svg';

import { getTimeAgo, formatKoreanDate } from './timeAgo';

export default function PostHeader({
  postData,
  isOwner: isOwnerProp = false,
  isMenuOpen = false,
  setIsMenuOpen = () => {},
  onBack = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onReport = () => {},
  currentUser,
}) {
  const authorName = postData?.author?.name ?? postData?.authorName ?? '작성자';

  // ✅ 작성자 식별값(백 응답 구조 방어)
  const authorId =
    postData?.author?.userId ??
    postData?.authorId ??
    postData?.author?.id ??
    null;

  const authorEmail = postData?.author?.email ?? postData?.authorEmail ?? null;

  const currentId = currentUser?.userId ?? currentUser?.id ?? null;
  const currentEmail = currentUser?.email ?? currentUser?.sub ?? null;

  // ✅ 타입/구조 차이 방어해서 "내 글" 판별
  const isMe =
    (authorId != null &&
      currentId != null &&
      String(authorId) === String(currentId)) ||
    (authorEmail &&
      currentEmail &&
      String(authorEmail).toLowerCase() === String(currentEmail).toLowerCase());

  // ✅ 부모에서 isOwner를 잘못 내려줘도, 여기서 보정
  const isOwner = Boolean(isOwnerProp || isMe);

  // ✅ createdAt/createAt 둘 다 방어
  const createdAt =
    postData?.createdAt ?? postData?.createAt ?? postData?.create_at ?? null;

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        type="button"
      >
        <img src={beforeIcon} alt="뒤로가기" className="h-4 w-4 opacity-60" />
        <span>이전으로</span>
      </button>

      <div className="flex items-start justify-between">
        <h1 className="mb-4 text-[40px] font-bold text-white">
          {postData?.title ?? ''}
        </h1>

        </div>

      <div className="mb-8 flex items-center gap-3">
        <img src={peopleShape} alt="프로필" className="h-5 w-5 opacity-80" />

        <span className="text-[15px] font-medium text-[#888888]">
          {authorName}
          {isMe && (
            <span className="ml-1 text-xs font-normal text-zinc-600">나</span>
          )}
        </span>

        <span className="text-[14px] text-[#888888]">
          {formatKoreanDate(createdAt)}
        </span>

        <span className="text-[14px] text-[#888888]">
          {getTimeAgo(createdAt)}
        </span>
      </div>
    </>
  );
}
