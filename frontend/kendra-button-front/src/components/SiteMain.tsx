import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from './ProgressBar';
import { ReactElement } from 'react';
import { Site } from '../types';
import { TitleEdit } from './TitleEdit';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { useModalContextImpls } from '../contexts';

// import { callGraphql } from '../utils';
interface Props {
  siteInfo?: Site;
}
const SiteMain = (props: Props): ReactElement => {
  const { setModalConfig } = useModalContextImpls();
  const { title, url, term, crawlerStatus } = props.siteInfo || {};
  const { total, done } = crawlerStatus || {};

  const askToDelete = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Are you sure?',
      content: `Are you really going to delete this site "${title}"?`,
      okaction: async ({ hideModal }) => {
        // TODO: call graphql that exec DELETE
        // callGraphql({ query: })
        console.log('delete!');
      },
    });
  };

  return (
    <>
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
      <TitleEdit title={title} />
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
        <label className="form-control-label font-weight-bold">{`Crawling & Indexing`}</label>
        <ProgressBar theme={`success`} done={done} total={total} />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export { SiteMain };