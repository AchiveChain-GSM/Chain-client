import { EditorContent } from '@tiptap/react';
import useWriteEditor from './useWriteEditor';
import './EditorStyle.css'; 

import EditorHeader from './EditorHeader';
import EditorToolbar from './EditorToolbar';
import EditorTags from './EditorTags';
import EditorFileUpload from './EditorFileUpload';

export default function WriteEditor() {
  const {
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
  } = useWriteEditor();

  if (!editor) return null;

  return (
    <div className="bg-bg flex h-full flex-col overflow-hidden rounded-tl-lg text-white">
      <main className="custom-scrollbar m-6 overflow-y-auto">
        {/* 1. 헤더 */}
        <EditorHeader title={title} setTitle={setTitle} />

        {/* 2. 툴바 */}
        <EditorToolbar editor={editor} actions={toolbarActions} />

        {/* 3. 에디터 본문 */}
        <div className="min-h-0 flex-1">
          <div className="rounded-lg p-4">
            <EditorContent editor={editor} />
          </div>

          <div className="">
            {/* 4. 태그 */}
            <EditorTags
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleTagKeyDown={handleTagKeyDown}
              removeTag={removeTag}
            />

            {/* 5. 파일 업로드 */}
            <EditorFileUpload
              files={files}
              removeFile={removeFile}
              formatFileSize={formatFileSize}
              previews={previews}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </div>
        </div>
      </main>
    </div>
  );
}