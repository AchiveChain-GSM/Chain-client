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

const lowlight = createLowlight(common);

export default function useWriteEditor(initialPost = null) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 파일 관리
  const [files, setFiles] = useState(() => {
    const init = initialPost?.files || [];
    return init.map((f) => ({
      id: f.id || f.fileId || Math.random().toString(36).slice(2),
      fileId: f.fileId || f.id || null,
      name: f.name || f.originalName || '첨부파일',
      size: f.size || 0,
      type: f.type || f.mimeType || '',
      url: f.url || null,
      file: f.file instanceof File ? f.file : null,
    }));
  });
  const [previews, setPreviews] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, 
      }),
      
      CodeBlockLowlight.configure({
        lowlight,
      }),

      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),

      Markdown.configure({
        html: false,             
        transformPastedText: true 
      }),
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
      return { id, fileId: null, name: file.name, size: file.size, type: file.type, file, url: null };
    });
    setFiles((prev) => [...prev, ...next]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (id) => {
    setFiles((prev) => {
      if (previews[id]) {
        URL.revokeObjectURL(previews[id]);
        setPreviews((p) => { const next = { ...p }; delete next[id]; return next; });
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

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const v = tagInput.trim();
      setTags((prev) => (prev.includes(v) ? prev : [...prev, v]));
      setTagInput('');
    }
  };
  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  const handlePublish = async () => {
    if (isSubmitting) return;
    if (!title.trim()) { alert('제목을 입력해주세요'); return; }

    const html = editor?.getHTML() || '';
    if (!html || html === '<p></p>') { alert('내용을 입력해주세요'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: html,
        tags,
        files,
      };
      
      console.log('📝 저장 데이터:', payload);
      alert('저장 완료! 콘솔을 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return {
    editor, title, setTitle, tags, tagInput, setTagInput, handleTagKeyDown, removeTag,
    files, removeFile, formatFileSize, previews, getRootProps, getInputProps, isDragActive,
    toolbarActions, handlePublish, isSubmitting,
  };
}