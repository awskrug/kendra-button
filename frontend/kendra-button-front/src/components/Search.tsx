import { BaseDocument, GqlSearchRes, search } from '../graphql/queries';
import { KeyboardEvent, ReactElement, useEffect, useState } from 'react';

import { SearchResult } from './SearchResult';
import { callGraphql } from '../utils';

interface Props {
  token: string;
}

const Search = (props: Props): ReactElement => {
  const { token } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeywords] = useState<string>('');
  const [error, setError] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BaseDocument[]>([]);

  useEffect(() => {
    setInputValue('');
    setKeywords('');
    setResult([]);
  }, [token]);

  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const searchHandler = async () => {
    if (inputValue.length === 0) {
      setError('Please type the keyword to find.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setKeywords(inputValue);

    try {
      const res = await callGraphql<GqlSearchRes>({
        query: search,
        variables: {
          keyword: inputValue,
          token,
        },
      });
      setResult(res.data.search.items);
      setIsLoading(false);
    } catch (e) {
      const error = e.errors[0].message;
      setError('Query Error: ' + error);
    }
    setIsLoading(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13) {
      searchHandler();
    }
  };

  return (
    <>
      <div className={`form-inline mb-4`}>
        <div className={`inputtext pr-2`}>
          <input
            type="text"
            className={`form-control w-100`}
            id="search-input"
            placeholder={`ex) What is Amazon Kendra?`}
            value={inputValue}
            onChange={onChangeHandler}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className={`searchbtn text-break`}>
          <button
            type="button"
            className={`btn btn-info shadow-sm w-100`}
            onClick={searchHandler}
          >{`Search`}</button>
        </div>
      </div>
      {isLoading ? (
        <div className={`p-3 text-primary font-weight-bold`}>Loading...</div>
      ) : !isLoading && !error && keyword.length > 0 ? (
        <SearchResult searchInput={keyword} result={result} />
      ) : !isLoading && error ? (
        <div className={`p-3 text-danger`}>
          <span className={`font-weight-bold`}>{error}</span>
        </div>
      ) : null}
      <style jsx>{`
        .inputtext {
          width: 80%;
        }
        .searchbtn {
          width: 20%;
        }
      `}</style>
    </>
  );
};

export { Search };
