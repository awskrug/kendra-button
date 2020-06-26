import { useEffect, useState } from 'react';

import sampledata from '../sampledata.json';

// import { callGraphql } from '../utils';
// import { search } from '../graphql/queries';

interface Props {
  searchInput: string;
  site: string;
}

const getFromNextApi = async (): Promise<any> => {
  // const res = await fetch('/api/search');
  // const res = await fetch(
  //   'https://temp-by-geoseong.s3.ap-northeast-2.amazonaws.com/sampledata.json',
  // );
  // console.log('res:', res);
  // const data = await res.json();

  // if (res.status !== 200) {
  //   throw new Error(data.message);
  // }
  // return data;
  return sampledata;
};
const SearchResult = (props: Props) => {
  const { searchInput, site } = props || {};
  const [result, setResult] = useState([]);

  // async & await 허용 안함
  useEffect(() => {
    getFromNextApi()
      .then((data) => {
        console.log('SearchResult data:', data);
        setResult(data.data.search.items);
      })
      .catch((e) => {
        console.log('error happened!', e);
      });
    // callGraphql({
    //   query: search,
    //   variables: {
    //     site,
    //     keyword: searchInput
    //   }
    // })
    //   .then(
    //     data => {
    //       console.log('result', data.data)
    //       // 안전
    //       if (data.data.search && data.data.search.items) {
    //         setResult(data.data.search.items)
    //       }
    //     }
    //   )
  }, []);

  return (
    <div className="px-3">
      <p className={`lead`}>Seach result for "{searchInput}"</p>
      {result.map((item, idx) => {
        if (idx <= 5) {
          const highlights = item.excerpt.highlights[0];
          const start = highlights.start;
          const end = highlights.end;

          const resultRange = [];

          const text = item.excerpt.text;
          if (start > 0) {
            resultRange.push(text.substring(0, start));
          }
          resultRange.push(
            <strong key={'highlight' + idx}>
              {' '}
              {text.substring(start, end)}
            </strong>,
          );

          if (end < text.length) {
            resultRange.push(text.substring(end, text.length));
          }

          return (
            <div className={`my-1`} key={idx}>
              <p className={`badge badge-pill badge-success`}> {idx + 1}</p>
              <p> {item.title.text}</p>
              <p> {resultRange}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export { SearchResult };
