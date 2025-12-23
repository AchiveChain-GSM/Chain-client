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

import {
  togglePostLike,
  togglePostBookmark,
} from '../../api/reactions';

// ❌ examplePost (더미 데이터) 삭제됨

function normalizeComment(res, postId) {
  return {
    commentId: res.commentId,
    postId,
    user: {
      userId: res.userId,
      name: res.userName,
    },
    content: res.content,
    createdAt: res.createAt,
  };
}

function normalizePost(raw, routeId) {
  return {
    postId: raw.id ?? routeId,
    title: raw.title,
    content: raw.content,
    tags: raw.tags ?? [],
    author:
      typeof raw.author === 'string'
        ? { userId: null, name: raw.author }
        : raw.author,
    likeCount: raw.likes ?? 0,
    bookmarkCount: raw.bookmarks ?? 0,
    viewCount: raw.views ?? 0,
    isLiked: raw.isLiked ?? false,
    isBookmarked: raw.isBookmarked ?? false,
    createdAt: raw.createAt,
    files: raw.files ?? [], // files가 없으면 빈 배열
    comments: [],
  };
}

export default function PostDetailView({ initialPost }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: 실제 로그인 유저로 교체
  const currentUser = { userId: 'me-001', name: '김유찬' };

  // ✅ 초기값을 null로 설정 (더미 데이터 사용 X)
  const [postData, setPostData] = useState(null);

  const [commentInput, setCommentInput] = useState('');
  const [commentPending, setCommentPending] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  // ✅ 헤더 메뉴 상태(점3개)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ 신고 모달
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // ✅ 내가 작성자인지 판별
  // postData가 로딩되기 전(null)일 때 에러 방지를 위해 optional chaining(?.) 사용
  const isOwner = useMemo(() => {
    if (!postData) return false;

    const authorId = postData.author?.userId;
    const myId = currentUser?.userId;

    if (authorId && myId) return authorId === myId;

    const authorName = postData.author?.name ?? '';
    const myName = currentUser?.name ?? '';
    return authorName && myName ? authorName === myName : false;
  }, [postData, currentUser]);

  // 게시글 조회
  useEffect(() => {
    let alive = true;

    // 만약 부모에게서 받은 initialPost가 있고 ID가 일치하면 그걸 먼저 씀
    if (initialPost && String(initialPost.id) === String(id)) {
      setPostData(normalizePost(initialPost, id));
    }

    getPost(id)
      .then((res) => {
        if (!alive) return;
        setPostData((prev) => ({
          ...normalizePost(res.data, id),
          // 기존 댓글이 있었다면 유지, 아니면 빈 배열
          comments: prev?.comments || [],
        }));
      })
      .catch((err) => {
        console.error(err);
        // 에러 시 처리 (예: alert 후 뒤로가기)
      });

    return () => {
      alive = false;
    };
  }, [id, initialPost]);

  // 댓글 조회
  const fetchComments = useCallback(async () => {
    try {
      const res = await getPostComments(id);
      setPostData((prev) => {
        // 아직 본문 데이터가 안 왔으면 댓글만 저장할 수 없으므로 방어
        if (!prev) return prev;
        return {
          ...prev,
          comments: res.data.map((c) => normalizeComment(c, Number(id))),
        };
      });
    } catch (e) {
      console.error('댓글 로딩 실패', e);
    }
  }, [id]);

  useEffect(() => {
    // postData가 있을 때만 댓글을 불러오거나, 병렬로 불러와도 됨
    fetchComments();
  }, [fetchComments]);

  
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
      setPostData((p) => ({
        ...p,
        isLiked: !p.isLiked,
        likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
      }));
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
      setPostData((p) => ({
        ...p,
        isBookmarked: !p.isBookmarked,
        bookmarkCount: p.isBookmarked
          ? p.bookmarkCount - 1
          : p.bookmarkCount + 1,
      }));
    } finally {
      setBookmarkPending(false);
    }
  };

  // ✅ 수정 페이지 이동 (ID 문제 해결)
  const handleEdit = () => {
    setIsMenuOpen(false);
    
    // postData.postId 대신 URL의 id를 직접 사용 (가장 안전함)
    navigate(`/posts/${id}/edit`);
  };

  // ✅ 삭제
  const handleDelete = async () => {
    setIsMenuOpen(false);

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      // ✅ 백엔드 삭제 API 연결
      await deletePost(id);

      alert('삭제되었습니다. (현재는 API 미연결 상태라 예시 알림입니다.)');
      navigate('/');
    } catch (e) {
      console.error(e);
      alert('삭제에 실패했습니다.');
    }
  };

  // ✅ 신고 열기
  const handleOpenReport = () => {
    setIsMenuOpen(false);
    setIsReportModalOpen(true);
  };

  // ✅ 데이터 로딩 중 처리 (화면 깨짐 방지)
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

        <PostFiles files={postData.files} />

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