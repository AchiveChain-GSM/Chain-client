import fileSelectIcon from '../../assets/uploadIcon/fileSelect.svg';
import docIcon from '../../assets/uploadIcon/doc.svg';
import deleteIcon from '../../assets/uploadIcon/x.svg';

export default function EditorFileUpload({
  files,
  removeFile,
  formatFileSize,
  previews,
  getRootProps,
  getInputProps,
  isDragActive,
}) {
  return (
    <div className="p-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer items-center justify-center border border-dashed py-10 transition-all ${
          isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <span className="pb-4 font-semibold text-[#888888]">
            파일을 여기에 끌어서 놓거나, 직접 파일 선택
          </span>
          <div className="bg-hover flex items-center gap-4 rounded-lg px-3 py-2">
            <img src={fileSelectIcon} alt="파일 선택" className="h-5 w-5" />
            <span>파일선택</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-3 py-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-full bg-[#4f4f4f] p-3 px-4"
            >
              {file.type?.startsWith('image/') && previews[file.id] ? (
                <img
                  src={previews[file.id]}
                  className="h-6 w-6 rounded object-cover"
                  alt={file.name}
                />
              ) : (
                <img src={docIcon} alt="문서" />
              )}

              <span className="flex-1 truncate text-sm text-white/90">
                {file.name}
              </span>

              <span className="mr-2 text-xs text-white/40">
                {formatFileSize(file.size)}
              </span>

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="text-white/30 hover:text-white"
              >
                <img src={deleteIcon} alt="삭제" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

