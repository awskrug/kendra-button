import { useEffect, useState } from 'react';

import { callGraphql } from '../utils';
import { search } from '../graphql/queries';

interface Props {
  searchInput: string;
  site: string;
}

const SearchResult = (props: Props) => {
  const { searchInput, site } = props || {};
  const [result, setResult] = useState([]);

  // async & await 허용 안함
  useEffect(() => {
    callGraphql({
      query: search,
      variables: {
        site,
        keyword: searchInput
      }
    })
      .then(
        data => {
          console.log('result', data.data)
          // 안전
          if (data.data.search && data.data.search.items) {
            setResult(data.data.search.items)
          }
        }
      )
  }, []);

  return (
    <div className="container">
      {result.length > 0 ? <p className={`lead`}>Search result for "{searchInput}"</p>
        : <p className={`text-danger`}>This service is currently unavailable.</p>}
      {result.map((item, idx) => {

        if (idx <= 5) {
          const highlights = item.excerpt.highlights[0]
          const start = highlights.start
          const end = highlights.end

          const resultRange = []

          const text = item.excerpt.text
          if (start > 0) {
            resultRange.push(text.substring(0, start))
          }
          resultRange.push(<strong key={'highlight' + idx}> {text.substring(start, end)}</strong>)

          if (end < text.length) {
            resultRange.push(text.substring(end, text.length))
          }

          return (

            <div className={`my-1`} key={idx}>
              <p className={`badge badge-pill badge-success`}> {idx + 1}</p>
              <p> {item.title.text}</p>
              <p> {resultRange}</p>
            </div>
          )
        }
      })
      }
    </div>
  );
};

export { SearchResult };
