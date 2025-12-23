import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

// ⚠️ 만약 api/reactions 파일이 없다면 이 부분은 ../../api/posts 로 수정하세요.
import { togglePostLike, togglePostBookmark } from '../../api/reactions';

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
    title: raw?.title ?? '',
    content: raw?.content ?? '',
    tags: raw?.tags ?? [],
    author:
      typeof raw?.author === 'string'
        ? { userId: null, name: raw.author }
        : (raw?.author ?? { userId: null, name: '' }),
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

export default function PostDetailView({ initialPost }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: 실제 로그인 유저로 교체 (Context 등 활용 권장)
  const currentUser = { userId: 'me-001', name: '김유찬' };

  const [postData, setPostData] = useState(null);
  const [error, setError] = useState(null); // ✅ 에러 상태 추가

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

    const authorName = postData.author?.name ?? '';
    const myName = currentUser?.name ?? '';
    return authorName && myName ? authorName === myName : false;
  }, [postData, currentUser]);

  // ✅ 파일 다운로드 핸들러 개선 (a 태그 사용)
  const handleDownload = useCallback((file) => {
    const url =
      typeof file === 'string'
        ? file
        : (file?.url ?? file?.fileUrl ?? file?.downloadUrl ?? file?.path);

    if (!url) {
      alert('다운로드 URL이 없습니다.');
      return;
    }

    // 가상 링크 생성하여 다운로드 시도
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = file.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // ✅ 게시글 조회
  useEffect(() => {
    let alive = true;
    setError(null); // ID 변경 시 에러 초기화

    // 초기 데이터가 있으면 먼저 설정 (UX 최적화)
    if (initialPost && String(initialPost.id) === String(id)) {
      setPostData(normalizePost(initialPost, id));
    }

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
        console.error(err);
        setError('게시글을 불러올 수 없습니다.'); // 에러 상태 업데이트
      });

    return () => {
      alive = false;
    };
  }, [id, initialPost]);

  // ✅ 댓글 조회
  const fetchComments = useCallback(async () => {
    try {
      const res = await getPostComments(id);
      const list = res?.data ?? res ?? [];

      setPostData((prev) => {
        // 게시글 데이터가 없으면 댓글을 넣을 수 없으므로 방어
        if (!prev) return prev;
        return {
          ...prev,
          comments: list.map((c) => normalizeComment(c, Number(id))),
        };
      });
    } catch (e) {
      console.error('댓글 로딩 실패', e);
    }
  }, [id]);

  // 게시글 로딩 완료 시 댓글 가져오기
  useEffect(() => {
    if (postData?.postId) {
      fetchComments();
    }
  }, [fetchComments, postData?.postId]);

  // 댓글 작성
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

  // 좋아요
  const handleToggleLike = async () => {
    if (likePending) return;

    setLikePending(true);
    try {
      await togglePostLike(id);
      setPostData((p) => {
        if (!p) return p;
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likeCount: nextLiked ? p.likeCount + 1 : Math.max(0, p.likeCount - 1),
        };
      });
    } catch (e) {
      console.error(e);
      alert('좋아요 처리 실패');
    } finally {
      setLikePending(false);
    }
  };

  // 북마크
  const handleToggleBookmark = async () => {
    if (bookmarkPending) return;

    setBookmarkPending(true);
    try {
      await togglePostBookmark(id);
      setPostData((p) => {
        if (!p) return p;
        const nextBookmarked = !p.isBookmarked;
        return {
          ...p,
          isBookmarked: nextBookmarked,
          bookmarkCount: nextBookmarked
            ? p.bookmarkCount + 1
            : Math.max(0, p.bookmarkCount - 1),
        };
      });
    } catch (e) {
      console.error(e);
      alert('북마크 처리 실패');
    } finally {
      setBookmarkPending(false);
    }
  };

  // 수정
  const handleEdit = () => {
    setIsMenuOpen(false);
    navigate(`/posts/${id}/edit`);
  };

  // 삭제
  const handleDelete = async () => {
    setIsMenuOpen(false);

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deletePost(id);
      alert('삭제되었습니다.');
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('삭제에 실패했습니다.');
    }
  };

  // 신고 열기
  const handleOpenReport = () => {
    setIsMenuOpen(false);
    setIsReportModalOpen(true);
  };

  // ⚠️ 에러 발생 시 UI
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-400">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 로딩 중 UI
  if (!postData) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-400">
        게시글을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="bg-bg flex h-full flex-col p-4 text-white">
      <main className="m-6 overflow-y-auto pr-6">
        <PostHeader
          postData={postData}
          isOwner={isOwner}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onBack={() => navigate(-1)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReport={handleOpenReport}
          currentUser={currentUser}
        />

        <PostBody
          postData={postData}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
          likePending={likePending}
          bookmarkPending={bookmarkPending}
        />

        <PostFiles files={postData.files} onDownload={handleDownload} />

        <PostComments
          comments={postData.comments}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          onSubmit={handleSubmitComment}
          currentUser={currentUser}
          commentPending={commentPending}
        />
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