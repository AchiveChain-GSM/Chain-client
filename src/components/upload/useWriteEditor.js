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

import { createPost, updatePost } from '../../api/posts';
import { useNavigate } from 'react-router-dom';

const lowlight = createLowlight(common);

export default function useWriteEditor(initialPost = null) {
  const navigate = useNavigate();

  // ✅ 수정모드 판단: postId / id 둘 다 대응
  const editPostId = initialPost?.postId ?? initialPost?.id ?? null;
  const isEdit = Boolean(editPostId);

  const [title, setTitle] = useState(initialPost?.title || '');

  // ✅ initialPost.tags가 string[]이 아닐 수 있어 정규화
  const [tags, setTags] = useState(() => {
    const raw = initialPost?.tags ?? [];
    const arr = Array.isArray(raw) ? raw : [raw];

    const flat = arr
      .flatMap((x) => {
        if (x == null) return [];
        if (typeof x === 'string') return [x];
        return [x?.name ?? x?.tagName ?? x?.value ?? ''];
      })
      .flatMap((s) => String(s).split(/[\t\n\r\f\v ,]+/g))
      .map((s) => s.trim().replace(/^#+/, ''))
      .filter(Boolean);

    const seen = new Set();
    const uniq = [];
    for (const t of flat) {
      if (seen.has(t)) continue;
      seen.add(t);
      uniq.push(t);
    }
    return uniq;
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 태그 정규화(입력/전송 공통)
  // - "#" 제거
  // - 콤마/공백으로 여러 개 입력 지원
  // - 중복/빈값 제거
  const normalizeTagsForRequest = useCallback((input) => {
    const arr = Array.isArray(input) ? input : [input];

    const flat = arr
      .flatMap((x) => {
        if (x == null) return [];
        if (typeof x === 'string') return [x];
        return [x?.name ?? x?.tagName ?? x?.value ?? ''];
      })
      .flatMap((v) => String(v).split(/[\s,]+/g))
      .map((v) => v.trim())
      .map((v) => v.replace(/^#+/, '')) // ###tag -> tag
      .filter(Boolean);

    const seen = new Set();
    const uniq = [];
    for (const t of flat) {
      if (seen.has(t)) continue;
      seen.add(t);
      uniq.push(t);
    }
    return uniq;
  }, []);

  // ✅ 수정 화면에서 tags가 객체로 내려와도 문자열로 정리해서 표시
  useEffect(() => {
    if (!initialPost) return;
    setTags((prev) => normalizeTagsForRequest(initialPost?.tags ?? prev));
  }, [initialPost, normalizeTagsForRequest]);

  function unescapeHtml(str) {
    if (!str) return '';
    const el = document.createElement('textarea');
    el.innerHTML = str;
    return el.value;
  }

  function looksLikeHtml(s) {
    const t = String(s || '').trim();
    return t.startsWith('<') && t.includes('>');
  }

  // ✅ 삭제된 기존 "이미지/파일"의 ID를 담을 상태
  // 백 스펙에 removeImage_ids 로 보낼 거라서 이름도 맞춰둠
  const [removeImage_ids, setRemoveImage_ids] = useState([]);

  // 파일 관리 초기화
  const [files, setFiles] = useState(() => {
    const init = initialPost?.files || [];
    return init.map((f) => ({
      id: Math.random().toString(36).slice(2),

      // 서버에 저장된 실제 ID (삭제 시 필요)
      // (백에서 imageId/fileId/id 무엇으로 주든 대응)
      fileId: f.fileId || f.imageId || f.id || null,

      name: f.name || f.originalName || '첨부파일',
      size: f.size || 0,
      type: f.type || f.mimeType || '',

      // 기존 이미지라면 url 존재
      url: f.url || f.imageUrl || f.downloadUrl || null,

      // 새로 올린 파일이면 File 객체 존재
      file: f.file instanceof File ? f.file : null,
    }));
  });

  const [previews, setPreviews] = useState(() => ({}));

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
    content: '',
    editorProps: {
      attributes: {
        class:
          'ProseMirror min-h-[300px] w-full text-white text-md outline-none leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const raw = initialPost?.content ?? '';
    if (!raw) {
      editor.commands.setContent('', false);
      return;
    }

    // 1) &lt;p&gt;...&lt;/p&gt; 처럼 escape된 HTML이면 복구
    const fixed = unescapeHtml(raw);

    // 2) HTML이면 HTML로, 아니면 텍스트로 넣기
    if (looksLikeHtml(fixed)) {
      editor.commands.setContent(fixed, false);
    } else {
      editor.commands.setContent(`<p>${fixed}</p>`, false);
    }
  }, [editor, initialPost?.content]);

  const toolbarActions = useMemo(
    () => ({
      toggleBold: () => editor?.chain().focus().toggleBold().run(),
      toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
      toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
      toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
      toggleH1: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      toggleH2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
      toggleOrderedList: () =>
        editor?.chain().focus().toggleOrderedList().run(),
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
        file,
        url: null,
      };
    });

    setFiles((prev) => [...prev, ...next]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // ✅ 파일(이미지) 삭제 로직
  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);

      // ✅ 이미 서버에 있던 파일(이미지)이라면 삭제 목록에 추가
      if (target?.fileId) {
        setRemoveImage_ids((ids) => [...ids, target.fileId]);
      }

      // ✅ 미리보기 URL 해제 (새로 올린 파일인 경우)
      if (previews[id]) {
        URL.revokeObjectURL(previews[id]);
        setPreviews((p) => {
          const next = { ...p };
          delete next[id];
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

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const next = normalizeTagsForRequest(tagInput);
      setTags((prev) => normalizeTagsForRequest([...prev, ...next]));
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

  // ✅ 게시/수정 처리
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

    // ✅ 태그 정규화(서버에는 항상 문자열 배열만 보냄)
    const safeTags = normalizeTagsForRequest(tags);

    // 카드/리스트용 요약(description)
    const plain = (editor?.getText?.() || '').replace(/\s+/g, ' ').trim();
    const description = plain.slice(0, 120);

    // 새로 추가한 파일 중 이미지/기타 분리
    const newImageFiles = files
      .filter((f) => f.file instanceof File && f.type?.startsWith('image/'))
      .map((f) => f.file);

    const newOtherFiles = files
      .filter((f) => f.file instanceof File && !f.type?.startsWith('image/'))
      .map((f) => f.file);

    setIsSubmitting(true);
    try {
      if (isEdit) {
        // ✅ [수정]
        await updatePost(editPostId, {
          title: title.trim(),
          content: html,
          tags: safeTags,
          images: newImageFiles,
          files: newOtherFiles,
          removeImage_ids, // ✅ 삭제된 기존 파일/이미지 id 리스트
        });

        navigate(`/posts/${editPostId}`, { replace: true });
      } else {
        // ✅ [생성]
        const newPostId = await createPost({
          title: title.trim(),
          description,
          content: html,
          tags: safeTags,
          images: newImageFiles,
          files: newOtherFiles,
        });

        navigate(`/posts/${newPostId}`, { replace: true });
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
