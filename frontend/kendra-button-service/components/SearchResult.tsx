import { BaseDocument, getSearchQry } from '../graphql';
import { ReactElement, useMemo, useState } from 'react';

import sampledata from '../sampledata.json';

interface Props {
  searchInput: string;
  result: BaseDocument[];
}

const pageCnt = 5;

const SearchResult = (props: Props): ReactElement => {
  const { searchInput, result } = props || {};
  const [page, setPage] = useState<number>(0);

  const Result = useMemo(() => {
    return result.reduce((accuR, currR, idxR) => {
      // 처음부터 특정 페이지까지 보기
      if (pageCnt * (page + 1) <= idxR) {
        return accuR;
      }
      // // 특정 페이지의 영역만 보기
      // if (idxR < pageCnt * page || pageCnt * (page + 1) <= idxR) {
      //   return accuR;
      // }

      const item = currR;
      const text = item.excerpt.text;
      const resultRange = item.excerpt.highlights.reduce((accu, curr, idx) => {
        const start = curr.start;
        const end = curr.end;
        if (start > 0) {
          accu.push(text.substring(0, start));
        }
        accu.push(
          <strong key={'highlight-' + idx} className={`text-info`}>
            {' '}
            {text.substring(start, end)}
          </strong>,
        );
        if (end < text.length) {
          accu.push(text.substring(end, text.length));
        }
        return accu;
      }, []);

      const openUrl = (): void => {
        window.open(item.url, '_blank');
      };

      accuR.push(
        <>
          <div
            className={`btn btn-light my-1 text-left searchresult`}
            key={idxR}
            onClick={openUrl}
          >
            <p className={`badge badge-pill badge-success`}> {idxR + 1}</p>
            <p>{item.title.text}</p>
            <p className={``}>{resultRange}</p>
          </div>
          <style jsx>{`
            .searchresult {
              text-transform: none !important;
            }
          `}</style>
        </>,
      );
      return accuR;
    }, []);
  }, [result, page]);

  const appendNextPage = (): void => {
    setPage(page + 1);
  };

  return (
    <div className="px-3">
      <p className={`lead`}>Search result for "{searchInput}"</p>
      {Result}
      <div
        role="button"
        className={`btn btn-outline-primary font-weight-bold`}
        onClick={appendNextPage}
      >
        Show More ...
      </div>
    </div>
  );
};

export { SearchResult };
