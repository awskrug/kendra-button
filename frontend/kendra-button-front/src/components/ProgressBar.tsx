interface Props {
  theme: string;
  total: number;
  done: number;
}
const ProgressBar = (props: Props) => {
  const { theme, total = 100, done = 0 } = props || {};
  // const [percent, setPercent] = useState(90);

  return (
    <div>
      <div className={`align-items-center d-flex justify-content-between pb-1`}>
        {/* <button
          className={`btn ` + ('btn-' + theme || '')}
          onClick={(e) => {
            if (percent < 100) {
              setPercent(percent + 1)
            }
          }}
        >{`INCREMENT(test)`}</button> */}
        <span>
          {done} / {total}
        </span>
      </div>
      <div className="progress">
        <div
          className={`progress-bar progress-bar-striped progress-bar-animated ${
            'bg-' + theme || ''
          }`}
          role={`progressbar`}
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
        ></div>
        <style jsx>{`
          .progress .progress-bar {
            width: ${(done / total) * 100}%;
          }
        `}</style>
      </div>
    </div>
  );
};

export { ProgressBar };
