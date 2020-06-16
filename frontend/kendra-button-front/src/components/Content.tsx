import { ReactElement, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from './ProgressBar';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useMainContextImpls } from '../contexts';

const Content = (): ReactElement => {
  const { states, dispatch } = useMainContextImpls();
  const [site, setSite] = useState(null);

  useEffect(() => {
    console.log('Content site', states.selectedSite);
  }, [states.selectedSite]);

  return (
    <>
      <div className={`content`}>
        <div
          className={`d-flex justify-content-between align-items-center p-3`}
        >
          <div className={`text-center text-danger`} role={'button'}>
            <FontAwesomeIcon
              className={`shadow-sm fa-2x rounded-circle`}
              icon={faCode}
            />
            <div>{`EMBED`}</div>
          </div>
          <div>
            <button className={`btn btn-light shadow-sm`}>{`DELETE`}</button>
            <button className={`btn btn-warning shadow-sm`}>{`SAVE`}</button>
          </div>
        </div>
        <h3 className={`px-3`}>{site || `Configuration`}</h3>
        <div className={`p-3`}>
          <div className="form-group">
            <label
              className="form-control-label font-weight-bold"
              htmlFor="input-title"
            >{`Title`}</label>
            <input
              type="text"
              className="form-control"
              id="input-title"
              placeholder={`input title`}
            />
            {/* <div className="valid-feedback">Success! You"ve done it.</div> */}
          </div>
          <div className="form-group">
            <label
              className="form-control-label font-weight-bold"
              htmlFor="input-url"
            >{`Url to crawl`}</label>
            <input
              type="text"
              className="form-control"
              id="input-url"
              placeholder={`input url`}
            />
            {/* <div className="valid-feedback">Success! You"ve done it.</div> */}
          </div>
          <div className="form-group">
            <label
              className="form-control-label font-weight-bold"
              htmlFor="select-term"
            >{`Crawl/index term`}</label>
            <select
              className="custom-select"
              id="select-term"
              defaultValue={`d`}
            >
              <option value={`d`}>{`Daily`}</option>
              <option value={`h`}>{`Hourly`}</option>
            </select>
          </div>
          <div className={`d-flex justify-content-end`}>
            <button
              className={`btn btn-primary shadow-sm`}
            >{`Crawl START`}</button>
          </div>
        </div>
        <hr className={`m-3`} />
        <h3 className={`px-3`}>{`Info`}</h3>
        <div className={`p-3`}>
          <label className="form-control-label font-weight-bold">{`Crawling`}</label>
          <ProgressBar theme={`success`} />
          <label className="form-control-label font-weight-bold">{`Indexing`}</label>
          <ProgressBar theme={`danger`} />
        </div>
      </div>
      <style jsx>{`
        .content {
          padding-left: 30%;
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </>
  );
};

export { Content };
