import { useState } from 'react';
import { SearchResult } from './SearchResult';
const Search = () => {

  const [inputValue, setInputValue] = useState("");

  const [keyword, setKeywords] = useState("");


  const onChangeHandler = e => {
    setInputValue(e.target.value);
  }

  const searchHandler = () => {
    setKeywords(inputValue)
    setInputValue('')
  }

  return (
    <div>
      <form className={`form-inline mb-4`}>
        <input
          type='text'
          className='form-control mr-sm-2 w-75'
          id='search-input'
          placeholder={`ex) What is Amazon Kendra?`}
          value={inputValue}
          onChange={onChangeHandler}
        />
        <button
          type='button'
          className={`btn btn-info shadow-sm`}
          onClick={searchHandler}
        >{`Search`}</button>
      </form>

      {keyword.length > 0 &&
        <SearchResult searchInput={keyword} />
      }
    </div>
  );
};

export { Search };


