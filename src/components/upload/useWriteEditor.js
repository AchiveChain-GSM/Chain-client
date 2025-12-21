import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';

export default function useWriteEditor() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: '내용 입력' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] w-full text-white text-md outline-none leading-relaxed',
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
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));
  const removeFile = (id) => setFiles(files.filter((f) => f.id !== id));
  const formatFileSize = (bytes) =>
    bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';

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
  };
}
