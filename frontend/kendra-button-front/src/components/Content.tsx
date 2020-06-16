import { ReactElement, useEffect } from 'react';
import { faCode, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from './ProgressBar';

const Content = (): ReactElement => {
  const { states } = useMainContextImpls();
  const { setModalConfig } = useModalContextImpls();
  const { title, url, term, crawlerStatus } = states.selectedSite || {};
  const { total, done } = crawlerStatus || {};

  useEffect(() => {
    console.log('Content site', states.selectedSite);
  }, [states.selectedSite]);

  const askToDelete = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Are you sure?',
      content: `Are you really going to delete this site "${title}"?`,
    });
  };

  return (
    <>
      <div className={`content`}>
        <div className={`d-flex justify-content-between p-3`}>
          <div className={`text-center text-danger`} role={'button'}>
            <FontAwesomeIcon className={`fa-2x`} icon={faCode} />
            <div>{`EMBED`}</div>
          </div>
          <div>
            <button
              className={`btn btn-danger shadow-sm`}
              onClick={askToDelete}
            >{`DELETE`}</button>
            {/* <button className={`btn btn-warning shadow-sm`}>{`SAVE`}</button> */}
          </div>
        </div>
        <div
          className={`h3 px-3 d-flex justify-content-between align-items-center`}
        >
          {title || `Site`}
          <FontAwesomeIcon
            className={`shadow-sm rounded-circle`}
            icon={faEdit}
            role={'button'}
          />
        </div>
        <div className={`p-3`}>
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
              defaultValue={url}
              disabled
            />
          </div>
          <div className="form-group">
            <label
              className="form-control-label font-weight-bold"
              htmlFor="select-term"
            >{`Crawl/index term`}</label>
            <select
              className="custom-select"
              id="select-term"
              defaultValue={term || 'd'}
              disabled
            >
              <option value={`d`}>{`Daily`}</option>
              <option value={`h`}>{`Hourly`}</option>
            </select>
          </div>
        </div>
        <hr className={`m-3`} />
        <h3 className={`px-3`}>{`Info`}</h3>
        <div className={`p-3`}>
          <label className="form-control-label font-weight-bold">{`Crawling`}</label>
          <ProgressBar theme={`success`} done={done} total={total} />
          <label className="form-control-label font-weight-bold">{`Indexing`}</label>
          <ProgressBar theme={`danger`} done={done} total={total} />
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
