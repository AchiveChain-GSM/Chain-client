import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';

export default function useWriteEditor(initialPost = null) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');

  // 파일은 “로컬 업로드 전 상태”로 관리 (나중에 서버 fileId/url로 치환)
  const [files, setFiles] = useState(() => {
    const init = initialPost?.files || [];
    return init.map((f) => ({
      // 초기값이 서버 파일이라면 fileId/url 형태를 유지
      id: f.id || f.fileId || Math.random().toString(36).slice(2),
      name: f.name || f.originalName || '첨부파일',
      size: f.size || 0,
      type: f.type || f.mimeType || '',
      url: f.url || null,
      file: f.file instanceof File ? f.file : null,
    }));
  });

  const [previews, setPreviews] = useState({}); // { [name]: objectUrl }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '내용 입력' }),
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-[300px] w-full text-white text-md outline-none leading-relaxed',
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
      const item = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        file, // 로컬 파일 객체
        url: null, // 나중에 업로드 성공 후 서버 url로 교체
      };

      if (file.type?.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({ ...prev, [file.name]: objectUrl }));
      }
      return item;
    });

    setFiles((prev) => [...prev, ...next]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const v = tagInput.trim();
      setTags((prev) => (prev.includes(v) ? prev : [...prev, v]));
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      // 이미지 preview objectURL 해제
      if (target?.name && previews[target.name]) {
        URL.revokeObjectURL(previews[target.name]);
        setPreviews((p) => {
          const next = { ...p };
          delete next[target.name];
          return next;
        });
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ✅ 게시하기(지금은 더미: 콘솔 출력) / 나중에 API로 교체
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

    setIsSubmitting(true);
    try {
      // 나중에 백엔드 연동 시 여기서:
      // 1) 파일 업로드 -> fileId/url 받기
      // 2) posts create/update 호출
      const payload = {
        postId: initialPost?.postId ?? initialPost?.id ?? null, // 수정 시 사용
        title: title.trim(),
        content: html,
        tags,
        files: files.map((f) => ({
          // 로컬 단계에서는 fileId 없음
          fileId: f.fileId || null,
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.url || null,
        })),
      };

      console.log('📝 PUBLISH_PAYLOAD', payload);
      alert('게시하기 버튼이 클릭되었습니다!\n(API 연동 후 실제 업로드로 교체)');
    } finally {
      setIsSubmitting(false);
    }
  };

  // unmount 시 preview 해제
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
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
