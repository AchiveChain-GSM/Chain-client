import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../upload/EditorStyle.css';

import PostHeader from './PostHeader';
import PostBody from './PostBody.jsx';
import PostFiles from './PostFiles';
import PostComments from './PostComments';
import ReportModal from './ReportModal';

const examplePost = {
  postId: 'post-001',
  title: '예시 글 제목입니다',
  content: '<p>이건 <strong>예시 본문</strong>입니다.</p>',
  tags: ['React', 'Frontend'],
  author: {
    userId: 'user-001',
    name: '김유찬',
  },
  likeCount: 3,
  bookmarkCount: 1,
  viewCount: 42,
  isLiked: false,
  isBookmarked: false,
  createdAt: new Date().toISOString(),
  files: [
    {
      fileId: 'file-001',
      originalName: 'example.pdf',
      url: 'https://example.com/example.pdf',
      size: 12345,
      mimeType: 'application/pdf',
    },
  ],
  comments: [
    {
      commentId: 'c-001',
      postId: 'post-001',
      user: { userId: 'user-002', name: '댓글러' },
      content: '댓글 예시입니다',
      createdAt: new Date().toISOString(),
    },
  ],
};

function normalizePost(raw, routeId) {
  const createdAt = raw?.createdAt || raw?.createAt || new Date().toISOString();

  const author =
    raw?.author && typeof raw.author === 'object'
      ? {
          userId: raw.author.userId ?? raw.author.id ?? null,
          name: raw.author.name ?? '작성자',
        }
      : { userId: raw?.authorId ?? null, name: raw?.author ?? '작성자' };

  return {
    postId: raw?.postId ?? raw?.id ?? routeId,
    title: raw?.title ?? '제목(더미)',
    content: raw?.content ?? '<p>내용(더미)</p>',
    tags: Array.isArray(raw?.tags) ? raw.tags : [],

    author,

    likeCount: raw?.likeCount ?? raw?.likes ?? 0,
    bookmarkCount: raw?.bookmarkCount ?? raw?.bookmarks ?? 0,
    viewCount: raw?.viewCount ?? raw?.views ?? 0,

    isLiked: raw?.isLiked ?? false,
    isBookmarked: raw?.isBookmarked ?? false,

    createdAt,
    updatedAt: raw?.updatedAt ?? raw?.updateAt ?? null,

    files: (raw?.files ?? []).map((f) => ({
      fileId: f?.fileId ?? f?.id ?? null,
      originalName: f?.originalName ?? f?.name ?? '첨부파일',
      size: f?.size ?? 0,
      mimeType: f?.mimeType ?? f?.type ?? '',
      url: f?.url ?? null,
      file: f?.file instanceof File ? f.file : null, // 로컬 파일 fallback
    })),

    comments: (raw?.comments ?? []).map((c) => ({
      commentId: c?.commentId ?? c?.id ?? null,
      postId: c?.postId ?? raw?.postId ?? raw?.id ?? routeId,
      user:
        c?.user && typeof c.user === 'object'
          ? {
              userId: c.user.userId ?? c.user.id ?? null,
              name: c.user.name ?? '익명',
            }
          : { userId: c?.userId ?? null, name: c?.author ?? '익명' },
      content: c?.content ?? '',
      createdAt: c?.createdAt ?? c?.createAt ?? null,
      updatedAt: c?.updatedAt ?? null,
    })),
  };
}

export default function PostDetailView({ initialPost }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO(연동 시): 인증에서 받아오면 됩니다.
  const currentUser = { userId: 'me-001', name: '김유찬' };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  /**
   * 여기서 “예시 데이터가 언제 쓰일지” 결정합니다.
   * 우선순위:
   * 1) initialPost (목록에서 state로 넘긴 데이터)
   * 2) examplePost (퍼블리싱 확인용)
   * 3) null (없으면 더미 텍스트)
   */
  const seedPost = useMemo(() => {
    return initialPost ?? examplePost ?? null;
  }, [initialPost]);

  const [postData, setPostData] = useState(() => normalizePost(seedPost, id));

  useEffect(() => {
    setPostData(normalizePost(seedPost, id));
  }, [seedPost, id]);

  const [, forceTick] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => forceTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    // TODO(연동 시):
    // - 여기서 GET /posts/:id 호출
    // - 응답을 normalizePost로 변환해서 setPostData 하면 끝입니다.
    // 예)
    // const data = await fetch(...)
    // setPostData(normalizePost(data, id));
  }, [id]);

  const isOwner =
    postData.author?.userId && currentUser?.userId
      ? postData.author.userId === currentUser.userId
      : postData.author?.name === currentUser?.name;

  const handleDownload = (file) => {
    // 1) 로컬 File
    if (file?.file instanceof File) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // 2) 서버 url
    if (file?.url) {
      window.open(file.url, '_blank', 'noopener,noreferrer');
      return;
    }

    alert('다운로드 링크가 없습니다. (API 연동 후 url/fileId로 처리)');
  };

  const handleToggleLike = () => {
    // TODO(연동 시): optimistic update + 실패 시 원복 / 서버 응답으로 count 동기화
    setPostData((prev) => ({
      ...prev,
      likeCount: prev.isLiked
        ? Math.max(0, prev.likeCount - 1)
        : prev.likeCount + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleToggleBookmark = () => {
    // TODO(연동 시): optimistic update + 실패 시 원복 / 서버 응답으로 count 동기화
    setPostData((prev) => ({
      ...prev,
      bookmarkCount: prev.isBookmarked
        ? Math.max(0, prev.bookmarkCount - 1)
        : prev.bookmarkCount + 1,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;

    // TODO(연동 시): POST /posts/:id/comments 후 서버가 준 commentId/createdAt로 갱신
    const newComment = {
      commentId: `temp-${Date.now()}`,
      postId: postData.postId,
      user: { userId: currentUser.userId, name: currentUser.name },
      content: commentInput.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    setPostData((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setCommentInput('');
  };

  const openReportModal = () => {
    setIsReportModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    // TODO(연동 시): DELETE /posts/:id
    alert('삭제되었습니다. (API 연동 후 실제 삭제로 교체)');
    navigate('/');
  };

 
  useEffect(() => {
    console.log('📦 seedPost:', seedPost);
    console.log('📦 postData:', postData);
  }, [seedPost, postData]);

  return (
    <div className="bg-bg flex h-full flex-col overflow-hidden rounded-tl-lg p-4 pb-0 text-white">
      <main className="custom-scrollbar m-6 mr-1 overflow-y-auto pr-6">
        <PostHeader
          postData={postData}
          isOwner={isOwner}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onBack={() => navigate(-1)}
          onEdit={() => navigate('/upload', { state: { post: postData } })}
          onDelete={handleDelete}
          onReport={openReportModal}
          currentUser={currentUser}
        />

        <PostBody
          postData={postData}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
        />

        <PostFiles files={postData.files} onDownload={handleDownload} />

        <PostComments
          comments={postData.comments}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          onSubmit={handleSubmitComment}
          currentUser={currentUser}
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
