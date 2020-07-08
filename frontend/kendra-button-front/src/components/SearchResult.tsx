interface Props {
  searchInput: string;
  result: any;
}

const SearchResult = (props: Props) => {
  const { searchInput, result } = props || {};

  return (
    <div className="container">
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
