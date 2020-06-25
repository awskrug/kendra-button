import { Site, User } from '../types';
import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { EmbedInstruction } from './EmbedInstruction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from './ProgressBar';
import { ReactElement } from 'react';
import { Search } from './Search';
import { SiteEdit } from './SiteEdit';
import { callGraphql } from '../utils';
import { deleteSite } from '../graphql/queries';
import { faCode } from '@fortawesome/free-solid-svg-icons';

interface Props {
  user?: User;
  siteInfo?: Site;
}
const SiteMain = (props: Props): ReactElement => {
  const { setModalConfig } = useModalContextImpls();
  const { dispatch } = useMainContextImpls();
  const { site, scrapEndpoint, term, crawlerStatus } = props.siteInfo || {};
  const { total, done } = crawlerStatus || {};

  const callEmbed = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Embed kendra-button to your website',
      content: <EmbedInstruction site={site} scrapEndpoint={scrapEndpoint} />,
    });
  };
  const askToDelete = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Are you sure?',
      content: `Are you really going to delete this site "${site}"?`,
      okaction: async ({ hideModal }) => {
        try {
          const res = await callGraphql({
            query: deleteSite,
            variables: {
              site,
            },
          });
        } catch (e) {
          console.log('catch e', e);
        } finally {
          dispatch({
            type: 'delete-site',
          });
          hideModal();
        }
      },
    });
  };

  return (
    <>
      <div className={`d-flex justify-content-between p-3`}>
        <div
          className={`text-center text-danger`}
          role={'button'}
          onClick={callEmbed}
        >
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
      <SiteEdit site={site} />
      <div className={`p-3`}>
        <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="input-scrapEndpoint"
          >{`Url to crawl`}</label>
          <input
            type="text"
            className="form-control"
            id="input-scrapEndpoint"
            placeholder={`input scrapEndpoint`}
            defaultValue={scrapEndpoint}
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

      <div className={`p-3`}>
        <Search site={site} />
      </div>

      <style jsx>{``}</style>
    </>
  );
};

export { SiteMain };
