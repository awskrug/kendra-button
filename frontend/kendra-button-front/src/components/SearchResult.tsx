import { useEffect, useState } from 'react';
import { callGraphql } from '../utils';
import { search } from '../graphql/queries';


interface Props {
  searchInput: string;
}

const SearchResult = (props: Props) => {
  const { searchInput } = props || {};
  const [result, setResult] = useState([]);

  // async & await 허용 안함
  useEffect(() => {
    callGraphql({ query: search, keyword: searchInput })
      .then(
        data => {
          console.log('result', data.data)
          // 안전
          if (data.data.search && data.data.search.items) {
            setResult(data.data.search.items)
            const resultSet = data.data.search.items
            console.log('length...', resultSet.length)

            console.log(data.data.search.items[0].excerpt.highlights[0].start)
            console.log(data.data.search.items[0].excerpt.highlights[0].end)

          }
        }
      )
  }, []);

  return (
    <div className="container">
      <p className={`lead`}>Seach result for "{searchInput}"</p>
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
