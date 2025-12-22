import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { marked } from 'marked';

const lowlight = createLowlight(common);
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function useWriteEditor(initialPost = null) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const [files, setFiles] = useState(() => {
    const init = initialPost?.files || [];
    return init.map((f) => ({
      id: f.id || f.fileId || Math.random().toString(36).slice(2),
      name: f.name || f.originalName || '첨부파일',
      size: f.size || 0,
      type: f.type || f.mimeType || '',
      url: f.url || null,
      file: f.file instanceof File ? f.file : null,
    }));
  });

  const [previews, setPreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 하이라이팅 확장을 위해 기본 codeBlock 비활성화
      }),
      CodeBlockLowlight.configure({
        lowlight, // 하이라이팅 엔진 등록
      }),
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
      handlePaste(view, event) {
        const raw = event.clipboardData?.getData('text/plain');
        if (!raw) return false;

        const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // 마크다운 문법 감지
        const isMarkdown = /^(#+\s|>\s|[\s]*[-*+]\s|[\s]*\d+\.\s|---)/m.test(text) || 
                           /(\*\*.+\*\*|__.+__|`.+`|```)/s.test(text);

        if (isMarkdown) {
          event.preventDefault();

          // 1. marked로 HTML 변환
          const html = marked.parse(text);

          // 2. 변환된 HTML 삽입
          // TipTap은 insertContent 시 내부적으로 HTML을 파싱하여 CodeBlockLowlight 노드로 변환합니다.
          // 이때 <code class="language-js"> 형태의 클래스가 있어야 하이라이팅이 정확히 작동합니다.
          if (editor) {
            editor.chain().focus().insertContent(html, {
              parseOptions: {
                preserveWhitespace: true,
              }
            }).run();
            return true;
          }
        }
        return false;
      },
    },
  });

  // ... (이하 toolbarActions, onDrop 등 기존 로직과 동일)
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
        file,
        url: null,
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
      const payload = {
        postId: initialPost?.postId ?? initialPost?.id ?? null,
        title: title.trim(),
        content: html,
        tags,
        files: files.map((f) => ({
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