import { KeyboardEvent, ReactElement, useState } from 'react';

import { GqlSearchResult } from '../graphql';
import { SearchResult } from './SearchResult';
import { callGraphql } from '../utils';

interface Props {
  site: string;
  domain: string;
  dev: string;
}

const Search = (props: Props): ReactElement => {
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeywords] = useState<string>('');
  const [result, setResult] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { site, domain, dev } = props;

  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const searchHandler = async (): Promise<any> => {
    if (inputValue.length === 0) {
      setError('Please type the keyword to find.');
      return;
    }
    setError(null);
    setKeywords(inputValue);
    setIsLoading(true);

    // validation
    // const validationRes = await callGraphql({
    //   text: inputValue,
    //   site,
    //   isValidation: true,
    //   dev,
    // });
    // console.log('validationRes', validationRes);
    // if (validationRes.status > 200) {
    //   setError('validation Query Error: ' + validationRes.message);
    //   setIsLoading(false);
    //   return;
    // }
    // // compare between validationRes.domain and props.domain
    // if (validationRes.data.site.domain !== domain) {
    //   setError(
    //     `Domain address of this site's configuration does not match the domain address here: (${domain})`,
    //   );
    //   setIsLoading(false);
    //   return;
    // }

    // Data Fetch
    const res = await callGraphql<GqlSearchResult>({ text: inputValue, site });
    if (res.status > 200) {
      setError('Query Error: ' + res.message);
    } else {
      setResult([...res.data.search.items]);
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
        <div className={`inputtext`}>
          <input
            type="text"
            className="form-control w-100"
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
        <style jsx>{`
          .inputtext {
            width: 80%;
          }
          .searchbtn {
            width: 20%;
          }
        `}</style>
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
    </>
  );
};

export { Search };
