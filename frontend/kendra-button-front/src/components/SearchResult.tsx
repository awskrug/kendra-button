import { useEffect, useState } from 'react';
import { callGraphql } from '../utils';
import { search } from '../graphql/queries';


interface Props {
  searchInput: string;
}

const SearchResult = (props: Props) => {
  const { searchInput } = props || {};
  const [result, setResult] = useState([]);

  // const [results, setResults] = useState(['haha']);

  // async & await 허용 안함
  useEffect(() => {
    callGraphql({ query: search, keyword: searchInput })
      .then(
        data => {
          console.log('왜', data.data)
          // 안전
          if (data.data.search && data.data.search.items) {
            setResult(data.data.search.items)
          }
        }
      )

  }, []);

  return (
    <div>
      {result.map((item, idx) => {
        console.log('itme?', item.excerpt.text)
        if (idx <= 5) {
          //jsx라서
          return (
            <li>{item.excerpt.text}</li>
          )
        }
      })
      }
    </div>
  );
};

export { SearchResult };
