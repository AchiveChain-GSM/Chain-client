import deleteIcon from '../../assets/uploadIcon/x.svg';

export default function EditorTags({
  tags,
  tagInput,
  setTagInput,
  handleTagKeyDown,
  removeTag,
}) {
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#4f4f4f] px-4 py-2 text-sm text-white"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <img src={deleteIcon} alt="삭제" className="h-4 w-4" />
            </button>
          </span>
        ))}

        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="태그 입력"
          className="min-w-[12px] flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
        />
      </div>
    </div>
  );
}
