import textColorIcon from '../../assets/uploadIcon/textColor.svg';
import boldIcon from '../../assets/uploadIcon/bold.svg';
import italicIcon from '../../assets/uploadIcon/italic.svg';
import h1Icon from '../../assets/uploadIcon/heading1.svg';
import h2Icon from '../../assets/uploadIcon/heading2.svg';
import underlineIcon from '../../assets/uploadIcon/underline.svg';
import strikeIcon from '../../assets/uploadIcon/strikethrough.svg';
import ulIcon from '../../assets/uploadIcon/unorderedList.svg';
import olIcon from '../../assets/uploadIcon/orderedList.svg';

// 내부에서만 쓰는 버튼 컴포넌트
function ToolbarBtn({ onClick, isActive, icon, alt }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
        isActive ? 'bg-select' : 'hover:bg-hover'
      } `}
    >
      <img src={icon} alt={alt} className={`h-4 w-4`} />
    </button>
  );
}

export default function EditorToolbar({ editor, actions }) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-4 pb-2 pt-2 backdrop-blur">
      {/* 텍스트 컬러 피커 */}
      <div className="relative flex items-center justify-center">
        <input
          type="color"
          onChange={actions.setColor}
          className="absolute inset-0 h-6 w-6 cursor-pointer opacity-0"
        />
        <img src={textColorIcon} alt="색상 선택" className="h-4 w-4" />
      </div>

      <div className="mx-2 h-4 w-px bg-[#444444]" />

      <ToolbarBtn
        onClick={actions.toggleH1}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={h1Icon}
        alt="제목 1"
      />
      <ToolbarBtn
        onClick={actions.toggleH2}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={h2Icon}
        alt="제목 2"
      />

      <div className="mx-2 h-4 w-px bg-[#444444]" />

      <ToolbarBtn
        onClick={actions.toggleBold}
        isActive={editor.isActive('bold')}
        icon={boldIcon}
        alt="굵게"
      />
      <ToolbarBtn
        onClick={actions.toggleItalic}
        isActive={editor.isActive('italic')}
        icon={italicIcon}
        alt="기울임"
      />
      <ToolbarBtn
        onClick={actions.toggleUnderline}
        isActive={editor.isActive('underline')}
        icon={underlineIcon}
        alt="밑줄"
      />
      <ToolbarBtn
        onClick={actions.toggleStrike}
        isActive={editor.isActive('strike')}
        icon={strikeIcon}
        alt="취소선"
      />

      <div className="mx-2 h-4 w-px bg-[#444444]" />

      <ToolbarBtn
        onClick={actions.toggleBulletList}
        isActive={editor.isActive('bulletList')}
        icon={ulIcon}
        alt="리스트"
      />
      <ToolbarBtn
        onClick={actions.toggleOrderedList}
        isActive={editor.isActive('orderedList')}
        icon={olIcon}
        alt="번호 리스트"
      />
    </div>
  );
}