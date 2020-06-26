import { ReactElement, useState } from 'react';

import { SearchResult } from './SearchResult';

interface Props {
  site: string;
}

const Search = (props: Props): ReactElement => {
  const [inputValue, setInputValue] = useState('');

  const [keyword, setKeywords] = useState('');

  const { site } = props;

  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const searchHandler = () => {
    setKeywords(inputValue);
    setInputValue('');
  };

  return (
    <>
      <form className={`form-inline mb-4`}>
        <div className={`col-10`}>
          <input
            type="text"
            className="form-control w-100"
            id="search-input"
            placeholder={`ex) What is Amazon Kendra?`}
            value={inputValue}
            onChange={onChangeHandler}
          />
        </div>
        <div className={`col-2`}>
          <button
            type="button"
            className={`btn btn-info shadow-sm w-100`}
            onClick={searchHandler}
          >{`Search`}</button>
        </div>
      </form>

      {keyword.length > 0 && <SearchResult site={site} searchInput={keyword} />}
    </>
  );
};

export { Search };
