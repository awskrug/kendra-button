import { ReactElement, useState } from 'react';

import { SearchResult } from './SearchResult';
import { callGraphql } from '../utils';

interface Props {
  site: string;
}

const Search = (props: Props): ReactElement => {
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeywords] = useState<string>('');
  const [result, setResult] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  const { site } = props;

  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const searchHandler = async (): Promise<any> => {
    setKeywords(inputValue);
    // setInputValue('');
    const res = await callGraphql({ text: inputValue, site });
    if (res.status > 200) {
      setError(res.message);
    } else {
      setResult(res);
    }
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

      {keyword.length > 0 && result.length > 0 && (
        <SearchResult searchInput={keyword} result={result} />
      )}
      {error && (
        <div className={`p-3 text-danger`}>
          Query Error: <span className={`font-weight-bold`}>{error}</span>
        </div>
      )}
    </>
  );
};

export { Search };
