import { KeyboardEvent, ReactElement, useState } from 'react';

import { SearchResult } from './SearchResult';
import { callGraphql } from '../utils';
import { search } from '../graphql/queries';

interface Props {
  site: string;
}

const Search = (props: Props): ReactElement => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>([]);

  const { site } = props;

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

    try {
      const res = await callGraphql({
        query: search,
        variables: {
          site,
          keyword: inputValue,
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
      ) : !isLoading && !error && inputValue.length > 0 ? (
        <SearchResult searchInput={inputValue} result={result} />
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
