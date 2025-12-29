import peopleIcon from '../../assets/icon/people.svg';
import { getTimeAgo } from './timeAgo';

function pickAuthorName(comment) {
  const name =
    comment?.userName ??
    comment?.user?.name ??
    comment?.authorName ??
    comment?.writerName ??
    comment?.memberName ??
    comment?.nickname ??
    comment?.author?.name ??
    comment?.author?.userName ??
    comment?.author?.nickname ??
    comment?.author ??
    '';

  if (String(name).trim()) return String(name).trim();

  const email =
    comment?.userEmail ??
    comment?.user?.email ??
    comment?.email ??
    comment?.author?.email ??
    '';

  if (email && String(email).includes('@')) return String(email).split('@')[0];

  return '익명';
}

function pickUserId(comment) {
  return (
    comment?.userId ??
    comment?.user?.userId ??
    comment?.authorId ??
    comment?.author?.userId ??
    comment?.memberId ??
    null
  );
}

function pickCreatedAt(comment) {
  return (
    comment?.createAt ?? // 백이 createAt로 주는 경우
    comment?.createdAt ??
    comment?.createdDate ??
    comment?.createdTime ??
    null
  );
}

export default function PostComments({
  comments = [],
  commentInput,
  setCommentInput,
  onSubmit,
  currentUser,
  commentPending = false,
}) {
  return (
    <div className="pb-20">
      <h3 className="mb-4 text-[18px] font-bold text-white">설명</h3>

      <div className="relative mb-8">
        <input
          type="text"
          value={commentInput}
          disabled={commentPending}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !commentPending && onSubmit?.()}
          placeholder={commentPending ? '등록 중...' : '설명 내용 입력'}
          className={[
            'h-[48px] w-full rounded-lg bg-[#191919] px-4 text-sm text-white outline-none',
            commentPending ? 'opacity-60' : '',
          ].join(' ')}
        />
        <button
          type="button"
          disabled={commentPending}
          onClick={() => !commentPending && onSubmit?.()}
          className={[
            'absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-white',
            commentPending ? 'cursor-not-allowed opacity-50' : '',
          ].join(' ')}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {comments.map((comment, idx) => {
          const key = comment.commentId ?? comment.id ?? `c-${idx}`;

          const authorName = pickAuthorName(comment);
          const commentUserId = pickUserId(comment);

          const isMe =
            commentUserId &&
            currentUser?.userId &&
            String(commentUserId) === String(currentUser.userId);

          const createdAt = pickCreatedAt(comment);

          return (
            <div key={key} className="group flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={peopleIcon}
                    alt=""
                    className="h-5 w-5 opacity-80"
                  />

                  <span className="text-[14px] font-medium text-zinc-300">
                    {authorName}
                    {isMe && (
                      <span className="ml-2 text-xs font-normal text-zinc-600">
                        나
                      </span>
                    )}
                  </span>

                  <span className="ml-2 text-[12px] text-text2">
                    {createdAt ? getTimeAgo(createdAt) : ''}
                  </span>
                </div>
              </div>

              <p className="pl-7 text-[14px] text-zinc-300">{comment.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
