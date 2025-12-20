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
      className="w-full rounded-md bg-[#444] p-3 px-5 text-white"
    />
  );
};

export default SearchInput;
