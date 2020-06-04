import { useEffect, useState } from 'react';

interface Props {
  theme: string;
}
const ProgressBar = (props: Props) => {
  const { theme } = props || {};
  const [percent, setPercent] = useState(0);

  return (
    <div>
      <div className={`align-items-center d-flex justify-content-between`}>
        <button
          className={`btn ` + ('btn-' + theme || '')}
          onClick={(e) => setPercent(percent + 1)}
        >{`INCREMENT`}</button>
        <span>{percent} / 100</span>
      </div>
      <div className='progress'>
        <div
          className={`progress-bar progress-bar-striped progress-bar-animated ${
            'bg-' + theme || ''
          }`}
          role={`progressbar`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
        <style jsx>{`
          .progress .progress-bar {
            width: ${percent}%;
          }
        `}</style>
      </div>
    </div>
  );
};

export { ProgressBar };
