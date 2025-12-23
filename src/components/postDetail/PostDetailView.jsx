import React from 'react';

export default function PostDetailView({
  postData,
  currentUser,
  handleDelete,
  handleToggleBookmark,
  handleToggleLike,
}) {
  //  AI 봇 제안: 이름이 비어있을 경우를 대비해 명시적으로 false 처리
  const isOwner = !!(
    postData?.author?.name &&
    currentUser?.name &&
    postData.author.name === currentUser.name
  );

  const onDeleteClick = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await handleDelete();
    } catch (err) {
      // AI 봇 제안: 에러 원인 파악을 위한 로그 추가
      console.error('게시글 삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const onLikeClick = async () => {
    try {
      await handleToggleLike();
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      alert('좋아요 실패');
    }
  };

  const onBookmarkClick = async () => {
    try {
      await handleToggleBookmark();
    } catch (err) {
      console.error('북마크 처리 실패:', err);
      alert('북마크 실패');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{postData?.title}</h1>
        {isOwner && (
          <div className="flex gap-2">
            <button className="text-zinc-400 hover:text-white">수정</button>
            <button
              onClick={onDeleteClick}
              className="text-red-400 hover:text-red-500"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-zinc-400">
        <span>{postData?.author?.name}</span>
        <span>{postData?.createdAt}</span>
      </div>

      <div className="min-h-[300px] leading-relaxed">{postData?.content}</div>

      <div className="flex gap-4 border-t border-zinc-800 pt-6">
        <button onClick={onLikeClick} className="flex items-center gap-2">
          <span>❤️ {postData?.likesCount || 0}</span>
        </button>
        <button onClick={onBookmarkClick} className="flex items-center gap-2">
          <span>🔖 북마크</span>
        </button>
      </div>
    </div>
  );
}
