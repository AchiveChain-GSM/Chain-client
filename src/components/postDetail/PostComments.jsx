import peopleIcon from '../../assets/icon/people.svg';
import { getTimeAgo } from './timeAgo';

export default function PostComments({
  comments = [],
  commentInput,
  setCommentInput,
  onSubmit,
  currentUser,
}) {
  return (
    <div className="pb-20">
      <h3 className="mb-4 text-[18px] font-bold text-white">댓글</h3>

      <div className="relative mb-8">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
          placeholder="댓글 내용 입력"
          className="h-[48px] w-full rounded-lg bg-[#191919] px-4 text-sm text-white outline-none"
        />
        <button
          type="button"
          onClick={() => onSubmit?.()}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {comments.map((comment, idx) => {
          const key = comment.commentId || comment.id || `c-${idx}`;
          const authorName = comment.user?.name ?? comment.author ?? '익명';

          const isMe =
            (comment.user?.userId && currentUser?.userId && comment.user.userId === currentUser.userId) ||
            authorName === (currentUser?.name ?? '');

          return (
            <div key={key} className="group flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={peopleIcon} alt="" className="h-5 w-5 opacity-80" />

                  <span className="text-[14px] font-medium text-zinc-300">
                    {authorName}
                    {isMe && (
                      <span className="ml-2 text-xs font-normal text-zinc-600">나</span>
                    )}
                  </span>

                  <span className="ml-2 text-[12px] text-text2">
                    {comment.createdAt ? getTimeAgo(comment.createdAt) : ''}
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
