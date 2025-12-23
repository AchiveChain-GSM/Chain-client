import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import '../upload/EditorStyle.css';

import PostHeader from './PostHeader';
import PostBody from './PostBody';
import PostFiles from './PostFiles';
import PostComments from './PostComments';
import ReportModal from './ReportModal';

import {
  getPost,
  getPostComments,
  createPostComment,
  deletePost,
} from '../../api/posts';

import { togglePostLike, togglePostBookmark } from '../../api/reactions';

// 데이터 형식을 일정하게 맞춰주는 도우미 함수들
function normalizeComment(res, postId) {
  return {
    commentId: res.commentId ?? res.id,
    postId,
    user: {
      userId: res.userId ?? res.user?.userId ?? null,
      name: res.userName ?? res.user?.name ?? '',
    },
    content: res.content ?? '',
    createdAt: res.createAt ?? res.createdAt ?? res.created_at ?? null,
  };
}

function normalizePost(raw, routeId) {
  return {
    postId: raw?.id ?? raw?.postId ?? routeId,
    title: raw?.title ?? '제목 없음',
    content: raw?.content ?? raw?.description ?? '내용이 없습니다.',
    tags: raw?.tags ?? [],
    author:
      typeof raw?.author === 'string'
        ? { userId: null, name: raw.author }
        : (raw?.author ?? { userId: null, name: '작성자 미상' }),
    likeCount: raw?.likes ?? raw?.likeCount ?? 0,
    bookmarkCount: raw?.bookmarks ?? raw?.bookmarkCount ?? 0,
    viewCount: raw?.views ?? raw?.viewCount ?? 0,
    isLiked: raw?.isLiked ?? false,
    isBookmarked: raw?.isBookmarked ?? false,
    createdAt: raw?.createAt ?? raw?.createdAt ?? null,
    files: raw?.files ?? [],
    comments: [],
  };
}

export default function PostDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = { userId: 'me-001', name: '김유찬' };

  // 1. 초기 데이터 설정: 카드를 통해 들어왔다면 그 데이터를 바로 사용하여 검은 화면 방지
  const [postData, setPostData] = useState(() => {
    if (location.state?.post) {
      return normalizePost(location.state.post, id);
    }
    return null;
  });

  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentPending, setCommentPending] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isOwner = useMemo(() => {
    if (!postData) return false;
    const authorId = postData.author?.userId;
    const myId = currentUser?.userId;
    if (authorId && myId) return authorId === myId;
    return (postData.author?.name || '') === (currentUser?.name || '');
  }, [postData, currentUser]);

  const handleDownload = useCallback((file) => {
    const url =
      typeof file === 'string'
        ? file
        : (file?.url ?? file?.fileUrl ?? file?.path);
    if (!url) {
      alert('다운로드 URL이 없습니다.');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = file.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // 2. 서버에서 최신 데이터 가져오기 (배경에서 실행)
  useEffect(() => {
    let alive = true;

    getPost(id)
      .then((res) => {
        if (!alive) return;
        const body = res?.data ?? res;
        setPostData((prev) => ({
          ...normalizePost(body, id),
          comments: prev?.comments || [],
        }));
      })
      .catch((err) => {
        if (!alive) return;
        console.error('서버 데이터 로딩 실패:', err);
        // ✅ 핵심 수정: postData(임시 데이터)가 이미 화면에 떠있다면 에러 메시지를 띄우지 않음
        if (!postData) {
          setError('게시글을 불러올 수 없습니다.');
        }
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getPostComments(id);
      const list = res?.data ?? res ?? [];
      setPostData((prev) =>
        prev
          ? {
              ...prev,
              comments: list.map((c) => normalizeComment(c, Number(id))),
            }
          : null,
      );
    } catch (e) {
      console.error('댓글 로딩 실패', e);
    }
  }, [id]);

  useEffect(() => {
    if (postData?.postId) fetchComments();
  }, [fetchComments, postData?.postId]);

  const handleSubmitComment = async () => {
    if (commentPending || !commentInput.trim()) return;
    setCommentPending(true);
    try {
      await createPostComment(id, commentInput);
      setCommentInput('');
      await fetchComments();
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setCommentPending(false);
    }
  };

  const handleToggleLike = async () => {
    if (likePending) return;
    setLikePending(true);
    try {
      await togglePostLike(id);
      setPostData((p) =>
        p
          ? {
              ...p,
              isLiked: !p.isLiked,
              likeCount: !p.isLiked
                ? p.likeCount + 1
                : Math.max(0, p.likeCount - 1),
            }
          : null,
      );
    } catch {
      alert('좋아요 실패');
    } finally {
      setLikePending(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (bookmarkPending) return;
    setBookmarkPending(true);
    try {
      await togglePostBookmark(id);
      setPostData((p) =>
        p
          ? {
              ...p,
              isBookmarked: !p.isBookmarked,
              bookmarkCount: !p.isBookmarked
                ? p.bookmarkCount + 1
                : Math.max(0, p.bookmarkCount - 1),
            }
          : null,
      );
    } catch {
      alert('북마크 실패');
    } finally {
      setBookmarkPending(false);
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    navigate(`/posts/${id}/edit`);
  };
  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePost(id);
      alert('삭제되었습니다.');
      navigate('/');
    } catch {
      alert('삭제 실패');
    }
  };

  // ⚠️ 진짜 데이터가 아무것도 없을 때만 에러 노출
  if (error && !postData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#121212] text-zinc-400">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded bg-zinc-800 px-4 py-2 text-white"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 로딩 중일 때도 검은 화면 방지 (배경색 명시)
  if (!postData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#121212] text-zinc-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#121212] text-white">
      <main className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-12">
        <div className="mx-auto max-w-[800px]">
          <PostHeader
            postData={postData}
            isOwner={isOwner}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onBack={() => navigate(-1)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReport={() => setIsReportModalOpen(true)}
            currentUser={currentUser}
          />

          <div className="mt-8">
            <PostBody
              postData={postData}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              likePending={likePending}
              bookmarkPending={bookmarkPending}
            />
          </div>

          {postData.files?.length > 0 && (
            <div className="mt-8">
              <PostFiles files={postData.files} onDownload={handleDownload} />
            </div>
          )}

          <div className="mt-12 border-t border-zinc-800 pt-8">
            <PostComments
              comments={postData.comments}
              commentInput={commentInput}
              setCommentInput={setCommentInput}
              onSubmit={handleSubmitComment}
              currentUser={currentUser}
              commentPending={commentPending}
            />
          </div>
        </div>
      </main>

      {isReportModalOpen && (
        <ReportModal
          postId={postData.postId}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
