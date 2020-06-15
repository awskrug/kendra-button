import { useEffect, /* useState  */ } from 'react';
import { callGraphql } from '../utils';
import { search } from '../graphql/queries';


interface Props {
  result: string[];
}

const SearchResult = (props: Props) => {
  const { result } = props || {};

  // const [results, setResults] = useState(['haha']);

  // async & await 허용 안함
  useEffect(() => {
    callGraphql({ query: search })
      .then(
        data => {
          if (data.data.results) {
            // setResults(data.data.results)
          }
        }
      )

  }, []);

  return (
    <div>
      {result}
    </div>
  );
};

export { SearchResult };
