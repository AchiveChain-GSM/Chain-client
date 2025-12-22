import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';

import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const lowlight = createLowlight(common);

marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function useWriteEditor(initialPost = null) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialPost?.title || '');
  const [tags, setTags] = useState(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '내용 입력' }),
    ],
    content: initialPost?.content || '',
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] w-full text-white text-md outline-none leading-relaxed',
      },
      handlePaste(view, event) {
        const raw = event.clipboardData?.getData('text/plain');
        if (!raw) return false;

        const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        const isMarkdown =
          /^(#+\s|>\s|[\s]*[-*+]\s|[\s]*\d+\.\s|---)/m.test(text) ||
          /(\*\*.+\*\*|__.+__|`.+`|```)/s.test(text);

        if (isMarkdown) {
          event.preventDefault();

          const html = marked.parse(text);

          editor.chain().focus().insertContent(html).run();

          return true;
        }

        return false;
      },
    },
  });
  const toolbarActions = {
    toggleBold: () => editor?.chain().focus().toggleBold().run(),
    toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
    toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
    toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
    toggleH1: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    toggleH2: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
    toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
    setColor: (e) => editor?.chain().focus().setColor(e.target.value).run(),
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          setPreviews((prev) => ({
            ...prev,
            [file.name]: URL.createObjectURL(file),
          }));
        }
        return {
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
        };
      });
      setFiles((prev) => [...prev, ...newFiles]);
    },
  });

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const next = tagInput.trim();
      if (!tags.includes(next)) setTags([...tags, next]);
      setTagInput('');
    }
  };

  const handlePublish = () => {
    const content = editor?.getHTML();
    if (!title.trim() || !content || content === '<p></p>') {
      alert('제목과 내용을 입력해주세요');
      return;
    }
    const newPostData = {
      postId: initialPost?.postId || Date.now(),
      title,
      content,
      author: '김유찬',
      tags,
      files,
      createAt: initialPost?.createAt || new Date().toISOString(),
    };
    navigate(`/post/${newPostData.postId}`, { state: { post: newPostData } });
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
    removeTag: (tag) => setTags(tags.filter((t) => t !== tag)),
    files,
    removeFile: (id) => setFiles(files.filter((f) => f.id !== id)),
    formatFileSize: (bytes) =>
      bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB',
    previews,
    getRootProps,
    getInputProps,
    isDragActive,
    toolbarActions,
    handlePublish,
  };
}
