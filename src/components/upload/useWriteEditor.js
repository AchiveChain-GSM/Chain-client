import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { createPost, updatePost } from '../../api/posts'; // updatePost import 확인
import { useNavigate } from 'react-router-dom';

const lowlight = createLowlight(common);

export default function useWriteEditor(initialPost = null) {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 삭제된 기존 파일의 ID를 담을 상태 추가
  const [removeFileIds, setRemoveFileIds] = useState([]);

  // 파일 관리 초기화
  const [files, setFiles] = useState(() => {
    const init = initialPost?.files || [];
    return init.map((f) => ({
      // 프론트에서 관리할 고유 ID (화면 표시용)
      id: Math.random().toString(36).slice(2), 
      // 서버에 저장된 실제 ID (삭제 시 필요)
      fileId: f.fileId || f.id || null, 
      name: f.name || f.originalName || '첨부파일',
      size: f.size || 0,
      type: f.type || f.mimeType || '',
      url: f.url || null, // 기존 이미지라면 url 존재
      file: f.file instanceof File ? f.file : null, // 새로 올린 파일이면 File 객체 존재
    }));
  });

  const [previews, setPreviews] = useState(() => {
    // 기존 이미지(url이 있는 경우) 미리보기 세팅
    const initialPreviews = {};
    if (initialPost?.files) {
      // 필요하다면 기존 URL을 previews에 넣을 수도 있지만, 
      // EditorFileUpload에서 file.url을 직접 쓰므로 여기선 빈 객체로 시작해도 무방합니다.
    }
    return initialPreviews;
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
      Markdown.configure({ html: false, transformPastedText: true }),
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class: 'ProseMirror min-h-[300px] w-full text-white text-md outline-none leading-relaxed',
      },
    },
  });

  const toolbarActions = useMemo(
    () => ({
      toggleBold: () => editor?.chain().focus().toggleBold().run(),
      toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
      toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
      toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
      toggleH1: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      toggleH2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
      setColor: (e) => editor?.chain().focus().setColor(e.target.value).run(),
    }),
    [editor],
  );

  const onDrop = useCallback((acceptedFiles) => {
    const next = acceptedFiles.map((file) => {
      const id = Math.random().toString(36).slice(2);
      if (file.type?.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({ ...prev, [id]: objectUrl }));
      }
      return {
        id,
        fileId: null, // 새 파일은 서버 ID 없음
        name: file.name,
        size: file.size,
        type: file.type,
        file, // File 객체 있음
        url: null,
      };
    });
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // ✅ 파일 삭제 로직 수정
  const removeFile = (id) => {
    setFiles((prev) => {
      // 1. 삭제하려는 파일 찾기
      const target = prev.find((f) => f.id === id);
      
      // 2. 이미 서버에 있던 파일(fileId 존재)이라면 삭제 목록(removeFileIds)에 추가
      if (target && target.fileId) {
        setRemoveFileIds((ids) => [...ids, target.fileId]);
      }

      // 3. 미리보기 URL 해제 (새로 올린 파일인 경우)
      if (previews[id]) {
        URL.revokeObjectURL(previews[id]);
        setPreviews((p) => {
          const next = { ...p };
          delete next[id];
          return next;
        });
      }
      
      // 4. UI 목록에서 제거
      return prev.filter((f) => f.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const v = tagInput.trim();
      setTags((prev) => (prev.includes(v) ? prev : [...prev, v]));
      setTagInput('');
    }
  };
  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ✅ 게시 및 수정 처리 핸들러
  const handlePublish = async () => {
    if (isSubmitting) return;

    if (!title.trim()) {
      alert('제목을 입력해주세요');
      return;
    }

    const html = editor?.getHTML() || '';
    if (!html || html === '<p></p>') {
      alert('내용을 입력해주세요');
      return;
    }

    // 새로 추가한 이미지 파일만 골라내기 (File 객체가 있는 것)
    const newImages = files
      .filter((f) => f.file instanceof File)
      .map((f) => f.file);

    setIsSubmitting(true);
    try {
      // ✅ initialPost.postId가 있으면 '수정', 없으면 '생성'
      if (initialPost?.postId) {
        // [수정]
        await updatePost(initialPost.postId, {
          title: title.trim(),
          content: html,
          tags,
          images: newImages,        // 새로 추가된 파일들
          removeImage_ids: removeFileIds, // 삭제된 기존 파일 ID들
        });
        
        // 수정 완료 후 해당 상세페이지로 이동
        navigate(`/posts/${initialPost.postId}`);
        
      } else {
        // [생성]
        const path = await createPost({
          title: title.trim(),
          content: html,
          tags,
          images: newImages,
        });

        // 응답 URL에서 ID 추출 (백엔드 응답 형식에 따라 조정 필요)
        const match = String(path).trim().match(/\/api\/posts\/(.+)/);
        if (match) {
          navigate(`/posts/${match[1]}`);
        } else {
          // path 파싱이 안되면 목록으로 이동하거나 처리
          navigate('/'); 
        }
      }
    } catch (e) {
      console.error(e);
      alert('저장 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () =>
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return {
    editor,
    title,
    setTitle,
    tags,
    tagInput,
    setTagInput,
    handleTagKeyDown,
    removeTag,
    files,
    removeFile,
    formatFileSize,
    previews,
    getRootProps,
    getInputProps,
    isDragActive,
    toolbarActions,
    handlePublish,
    isSubmitting,
  };
}