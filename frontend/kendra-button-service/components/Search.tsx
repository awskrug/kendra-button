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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { site } = props;

  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const searchHandler = async (): Promise<any> => {
    if (inputValue.length === 0) {
      setError('Please type the keyword to find.');
      return;
    }
    setKeywords(inputValue);
    setIsLoading(true);
    const res = await callGraphql({ text: inputValue, site });
    if (res.status > 200) {
      setError('Query Error: ' + res.message);
    } else {
      setResult(res);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form className={`form-inline mb-4`}>
        <div className={`inputtext`}>
          <input
            type="text"
            className="form-control w-100"
            id="search-input"
            placeholder={`ex) What is Amazon Kendra?`}
            value={inputValue}
            onChange={onChangeHandler}
          />
        </div>
        <div className={`searchbtn text-break`}>
          <button
            type="button"
            className={`btn btn-info shadow-sm w-100`}
            onClick={searchHandler}
          >{`Search`}</button>
        </div>
        <style jsx>{`
          .inputtext {
            width: 80%;
          }
          .searchbtn {
            width: 20%;
          }
        `}</style>
      </form>

      {keyword.length > 0 && result.length > 0 && (
        <SearchResult searchInput={keyword} result={result} />
      )}
      {isLoading && (
        <div className={`p-3 text-primary font-weight-bold`}>Loading...</div>
      )}
      {error && (
        <div className={`p-3 text-danger`}>
          <span className={`font-weight-bold`}>{error}</span>
        </div>
      )}
    </>
  );
};

export { Search };
