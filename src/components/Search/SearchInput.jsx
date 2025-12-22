import { useState } from 'react';

const SearchInput = ({ initialValue = '', onSearch }) => {
  const [keyword, setKeyword] = useState(initialValue);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!keyword.trim()) return;
      onSearch(keyword);
    }
  };

  return (
    /* 최대 1144px 유지, 화면 작아지면 w-full로 반응형 작동 */
    <div className="w-full max-w-[1144px]">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색어 입력"
        /* 테두리(border)를 없애고 디자인 높이 48px 적용 */
        className="h-[48px] w-full rounded-md bg-[#191919] px-5 text-white placeholder:text-[#444444] focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
