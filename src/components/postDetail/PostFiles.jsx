import docIcon from '../../assets/uploadIcon/doc.svg';

export default function PostFiles({ files = [], onDownload }) {
  return (
    <div className="mb-12">
      <h3 className="mb-4 text-[18px] font-bold text-white">
        첨부파일
        <span className="ml-1 text-sm text-zinc-500">{files.length}</span>
      </h3>

      <div className="flex flex-col gap-3">
        {files.map((file, idx) => {
          const key = file.fileId || file.id || `${file.originalName || file.name}-${idx}`;
          const label = file.originalName || file.name || '첨부파일';

          return (
            <div
              key={key}
              onClick={() => onDownload?.(file)}
              className="group flex cursor-pointer items-center justify-between rounded-lg bg-[#2A2A2A] px-4 py-3 hover:bg-[#333]"
            >
              <div className="flex items-center gap-3">
                <img src={docIcon} alt="" className="h-5 w-5 opacity-70" />
                <span className="text-sm text-zinc-300 group-hover:text-white">
                  {label}
                </span>
              </div>

              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
