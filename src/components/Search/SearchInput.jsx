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
    <input
      type="text"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="검색어 입력"
      className="h-[36px] w-[860px] rounded-md bg-[#191919] px-5 text-white placeholder:text-[#444444] focus:outline-none"
    />
  );
};

export default SearchInput;
