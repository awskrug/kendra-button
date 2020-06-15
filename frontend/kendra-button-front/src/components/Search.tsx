import { useState } from 'react';
import { SearchResult } from './SearchResult';
const Search = () => {

  const [inputValue, setInputValue] = useState("");

  const [keyword, setKeywords] = useState([""]);


  const onChangeHandler = e => {
    setInputValue(e.target.value);
  }

  const searchHandler = () => {
    setKeywords(this.inputValue)
  }

  return (
    <div>
      <form className='form-inline'>
        <input
          type='text'
          className='form-control mr-sm-2 w-75'
          id='search-input'
          placeholder={`What is Amazon Kendra?`}
          value={inputValue}
          onChange={onChangeHandler}
        />
        <button
          type='button'
          className={`btn btn-info shadow-sm`}
          onClick={searchHandler}
        >{`Search`}</button>
      </form>
      <SearchResult result={keyword} />
    </div>
  );
};

export { Search };


