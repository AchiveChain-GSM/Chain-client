// src/pages/PostDetail.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

import '../components/upload/EditorStyle.css';

import PostHeader from '../components/postDetail/PostHeader';
import PostBody from '../components/postDetail/PostBody.jsx';
import PostFiles from '../components/postDetail/PostFiles';
import PostComments from '../components/postDetail/PostComments';
import ReportModal from '../components/postDetail/ReportModal';

import {
  getPostPublic as getPost,
  createPostComment,
  deletePost,
} from '../api/posts';
import { togglePostLike, togglePostBookmark } from '../api/reactions';
import { getCurrentUser } from '../api/auth';

/* =========================
 * Normalizers
 * ========================= */

function normalizeImages(raw) {
  const img = raw?.images ?? raw?.imageUrls ?? raw?.imageList ?? raw?.imageMap;
  if (!img) return [];
  if (img && typeof img === 'object' && !Array.isArray(img)) {
    return Object.values(img).filter(Boolean);
  }
  if (Array.isArray(img)) return img.filter(Boolean);
  return [];
}

function normalizeTags(raw) {
  const t = raw?.tags ?? raw?.tagList ?? [];
  if (!Array.isArray(t)) return [];
  return t
    .map((x) => (typeof x === 'string' ? x : (x?.name ?? x?.tagName ?? null)))
    .filter(Boolean);
}

function pickCommentAuthorName(c) {
  const name =
    c?.userName ??
    c?.username ??
    c?.user_name ??
    c?.user?.name ??
    c?.user?.userName ??
    c?.authorName ??
    c?.writerName ??
    c?.memberName ??
    c?.nickname ??
    c?.author?.name ??
    c?.author?.userName ??
    c?.author?.nickname ??
    c?.author ??
    '';

  if (String(name).trim()) return String(name).trim();

  const email =
    c?.userEmail ??
    c?.user?.email ??
    c?.email ??
    c?.authorEmail ??
    c?.author?.email ??
    '';

  if (email && String(email).includes('@')) return String(email).split('@')[0];

  return '';
}

function normalizeComments(raw, postId) {
  const list = raw?.comments ?? raw?.postComments ?? raw?.commentList ?? [];
  if (!Array.isArray(list)) return [];

  return list.map((c) => {
    const userId =
      c?.userId ??
      c?.user?.userId ??
      c?.user?.id ??
      c?.authorId ??
      c?.author?.userId ??
      c?.memberId ??
      null;

    const name = pickCommentAuthorName(c);

    return {
      commentId: c?.commentId ?? c?.id ?? null,
      postId,

      // ✅ PostComments에서 바로 볼 수 있게 userName도 유지
      userName:
        c?.userName ?? c?.username ?? c?.writerName ?? c?.nickname ?? null,

      user: {
        userId,
        name, // ✅ 핵심: 여기 확실히 채우기
        email:
          c?.userEmail ??
          c?.user?.email ??
          c?.authorEmail ??
          c?.author?.email ??
          null,
      },

      content: c?.content ?? '',
      createdAt: c?.createAt ?? c?.createdAt ?? c?.created_at ?? null,
    };
  });
}

function normalizeAuthor(raw) {
  if (raw?.user && typeof raw.user === 'object') {
    return {
      userId: raw.user.userId ?? raw.user.id ?? null,
      name: raw.user.name ?? raw.user.username ?? '',
      email: raw.user.email ?? null,
    };
  }
  return {
    userId: raw?.authorId ?? null,
    name: raw?.author ?? '',
    email: raw?.authorEmail ?? null,
  };
}

function normalizePost(raw, routeId) {
  if (!raw) return null;

  const postId = raw?.postId ?? raw?.id ?? routeId;

  return {
    postId,
    title: raw?.title ?? '',
    content: raw?.content ?? '',
    author: normalizeAuthor(raw),
    tags: normalizeTags(raw),
    images: normalizeImages(raw),
    files: Array.isArray(raw?.files) ? raw.files : [],
    likes: raw?.likes ?? 0,
    bookmarks: raw?.bookmarks ?? 0,
    views: raw?.views ?? 0,
    isLiked: raw?.isLiked ?? false,
    isBookmarked: raw?.isBookmarked ?? false,
    createdAt: raw?.createAt ?? raw?.createdAt ?? null,
    comments: normalizeComments(raw, postId),
  };
}

/* =========================
 * Page (AUTH REQUIRED)
 * ========================= */

export default function PostDetail() {
  const { id } = useParams();
  const postId = useMemo(() => Number(id), [id]);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState(null);

  const [commentInput, setCommentInput] = useState('');
  const [commentPending, setCommentPending] = useState(false);

  const [likePending, setLikePending] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isOwner = useMemo(() => {
    if (!postData || !currentUser?.isAuthenticated) return false;
    if (currentUser.userId && postData.author?.userId) {
      return String(currentUser.userId) === String(postData.author.userId);
    }
    return (currentUser.name || '') === (postData.author?.name || '');
  }, [postData, currentUser]);

  const refreshPost = useCallback(async () => {
    const res = await getPost(postId);
    const raw = res?.data ?? res;
    setPostData(normalizePost(raw, postId));
  }, [postId]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // ✅ 인증필수이므로 여기서도 한번 더 방어
      if (!currentUser?.isAuthenticated) {
        navigate('/login', { replace: true, state: { from: location } });
        return;
      }

      if (!postId || Number.isNaN(postId)) {
        setLoading(false);
        setPostData(null);
        return;
      }

      try {
        setLoading(true);

        const res = await getPost(postId); // 401이면 axios가 토큰정리+로그인 보냄
        const raw = res?.data ?? res;

        if (!mounted) return;

        setPostData(normalizePost(raw, postId));
        setIsReportModalOpen(false);
        setIsMenuOpen(false);
      } catch (e) {
        const status = e?.response?.status;

        // ✅ 인증필수 정책: 401은 여기서 처리하지 말고(axios가 처리),
        // 그 외만 화면 처리
        if (status === 404) {
          setPostData(null);
        } else {
          setPostData(null);
          console.error('[getPost fail]', status, e?.response?.data, e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [postId, currentUser?.isAuthenticated, navigate, location]);

  const onClickEdit = () => {
    if (!postData?.postId) return;
    setIsMenuOpen(false);
    navigate(`/posts/${postData.postId}/edit`, { state: { post: postData } });
  };

  const onClickDelete = async () => {
    if (!postData?.postId) return;
    setIsMenuOpen(false);

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deletePost(postData.postId);
      navigate(-1);
    } catch (e) {
      console.error(
        '[deletePost fail]',
        e?.response?.status,
        e?.response?.data,
      );
      alert('삭제에 실패했습니다.');
    }
  };

  const onToggleLike = async () => {
    if (!postData?.postId || likePending) return;
    setLikePending(true);
    try {
      const res = await togglePostLike(postData.postId);
      setPostData((prev) => {
        if (!prev) return prev;
        const nextLiked = res?.liked ?? res?.isLiked ?? !prev.isLiked;
        const nextLikes =
          res?.likes ??
          res?.likeCount ??
          (nextLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1));
        return { ...prev, isLiked: nextLiked, likes: nextLikes };
      });
    } catch (e) {
      console.error('Like failed', e);
    } finally {
      setLikePending(false);
    }
  };

  const onToggleBookmark = async () => {
    if (!postData?.postId || bookmarkPending) return;
    setBookmarkPending(true);
    try {
      const res = await togglePostBookmark(postData.postId);
      setPostData((prev) => {
        if (!prev) return prev;
        const nextBookmarked =
          res?.bookmarked ?? res?.isBookmarked ?? !prev.isBookmarked;
        const nextBookmarks =
          res?.bookmarks ??
          res?.bookmarkCount ??
          (nextBookmarked
            ? prev.bookmarks + 1
            : Math.max(0, prev.bookmarks - 1));
        return {
          ...prev,
          isBookmarked: nextBookmarked,
          bookmarks: nextBookmarks,
        };
      });
    } catch (e) {
      console.error('Bookmark failed', e);
    } finally {
      setBookmarkPending(false);
    }
  };

  const onSubmitComment = async () => {
    if (!postData?.postId) return;

    const content = commentInput.trim();
    if (!content || commentPending) return;

    try {
      setCommentPending(true);
      await createPostComment(postData.postId, { content });
      setCommentInput('');
      await refreshPost();
    } catch (e) {
      console.error(
        '[createComment fail]',
        e?.response?.status,
        e?.response?.data,
      );
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setCommentPending(false);
    }
  };

  const onOpenReport = () => {
    setIsMenuOpen(false);
    setIsReportModalOpen(true);
  };

  return (
    <Layout>
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col px-6 py-10 bg-bg ml-4 rounded-lg">
        {loading && !postData ? (
          <div className="py-24 text-center text-zinc-400">불러오는 중…</div>
        ) : !postData ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center text-zinc-400">
            <p>삭제되었거나 존재하지 않는 게시글입니다.</p>
            <button
              type="button"
              className="rounded-lg bg-white/10 px-4 py-2 text-[14px] text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              돌아가기
            </button>
          </div>
        ) : (
          <>
            <PostHeader
              postData={postData}
              isOwner={isOwner}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onBack={() => navigate(-1)}
              onEdit={onClickEdit}
              onDelete={onClickDelete}
              onReport={onOpenReport}
              currentUser={currentUser}
            />

            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
              <PostBody
                postData={postData}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                likePending={likePending}
                bookmarkPending={bookmarkPending}
              />

              <PostFiles files={postData?.files ?? []} />

              <PostComments
                comments={postData?.comments ?? []}
                commentInput={commentInput}
                setCommentInput={setCommentInput}
                onSubmit={onSubmitComment}
                commentPending={commentPending}
                currentUser={currentUser}
              />
            </div>

            {isReportModalOpen && (
              <ReportModal
                postId={postData.postId}
                onClose={() => setIsReportModalOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
