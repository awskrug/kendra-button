import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import {
  GqlDeleteSiteRes,
  GqlUpdateSiteRes,
  SiteNode,
  deleteSite,
  updateSite,
} from '../graphql/queries';
import { callGraphql, regDomain } from '../utils';
import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { EmbedInstruction } from './EmbedInstruction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from './Loader';
import { Logger } from 'aws-amplify';
import { ProgressBar } from './ProgressBar';
import { Search } from './Search';
import { User } from '../types';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const logger = new Logger('SiteMain');

interface Props {
  user?: User;
  siteInfo?: SiteNode;
}

const SiteMain = (props: Props): ReactElement => {
  const { setModalConfig } = useModalContextImpls();
  const { dispatch } = useMainContextImpls();
  const { name, scrapEndpoint, domain, crawlerStatus, siteId, token } =
    props.siteInfo || {};
  const [domainInput, setDomainInput] = useState(domain);
  const [isLoading, setIsLoading] = useState(false);
  const { total, done } = crawlerStatus || {};

  useEffect(() => {
    setDomainInput(domain);
  }, [props.siteInfo]);

  const callEmbed = (): void => {
    setModalConfig({
      positionTop: '10%',
      type: 'plain',
      display: true,
      title: 'Embed kendra-button to your website',
      content: <EmbedInstruction site={token} domain={domain} />,
    });
  };
  const askToDelete = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Are you sure?',
      content: `Are you really going to delete this site "${name}"?`,
      okaction: async ({ hideModal }) => {
        try {
          const res = await callGraphql<GqlDeleteSiteRes>({
            query: deleteSite,
            variables: {
              siteId,
            },
          });
          logger.info('delete res', res);
        } catch (e) {
          logger.error('catch e', e);
        } finally {
          dispatch({
            type: 'delete-site',
          });
          hideModal();
        }
      },
    });
  };
  const domainOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDomainInput(e.target.value);
  };
  const onUpdateSite = async (): Promise<void> => {
    if (isLoading) {
      return;
    }
    if (!domainInput) {
      setModalConfig({
        type: 'plain',
        display: true,
        title: 'Update Site validation error',
        content: '"Domain" field is not typed',
      });
      return;
    }

    const validatedDomainInput = domainInput.match(regDomain);
    const compareDomain =
      (validatedDomainInput && validatedDomainInput[1]) ||
      domainInput.split('/')[0];
    const domainFromEndpoint = scrapEndpoint.match(regDomain);

    logger.info({ validatedDomainInput, compareDomain, domainFromEndpoint });

    if (!domainFromEndpoint || domainFromEndpoint.length < 2) {
      setModalConfig({
        type: 'plain',
        display: true,
        title: 'Update Site validation error',
        content: '"Crawling URL" value is invalid',
      });
      return;
    }

    setIsLoading(true);
    const res = await callGraphql<GqlUpdateSiteRes>({
      query: updateSite,
      variables: {
        name,
        domain: domainInput,
        siteId,
      },
    });

    dispatch({
      type: 'change-site',
      payload: {
        selectedSite: res.data.updateSite.site,
      },
    });

    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Update Site Success',
      content: (
        <>
          <div className="my-3">{`It would take up to 10 minutes to crawl and 60 minutes to index your site.`}</div>
          <div className="my-2">
            {`If you embed this to your site, `}{' '}
            <u>{`you have to change the url`}</u>
            {` looking `}
            <b>{`"EMBED"`}</b>
            {` instruction`}
          </div>
          <div className="my-2">{`because search token is re-genereated.`}</div>
        </>
      ),
    });

    setIsLoading(false);
  };

  return (
    <>
      <div
        className={`h3 p-3 d-flex justify-content-between align-items-center`}
      >
        {name}
      </div>
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
      <div className={`p-3`}>
        <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="input-scrapEndpoint"
          >{`Crawling URL`}</label>
          <input
            type="text"
            className="form-control"
            id="input-scrapEndpoint"
            placeholder={`input scrapEndpoint`}
            value={scrapEndpoint}
            disabled
          />
        </div>
        <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="input-scrapEndpoint"
          >{`Domain`}</label>
          <input
            type="text"
            className="form-control"
            id="input-domain"
            placeholder={`input domain`}
            onChange={domainOnChange}
            value={domainInput}
          />
        </div>
        {/* <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="select-term"
          >{`Crawl/index term`}</label>
          <select
            className="custom-select"
            id="select-term"
            value={term || 'd'}
            disabled
          >
            <option value={`d`}>{`Daily`}</option>
            <option value={`h`}>{`Hourly`}</option>
          </select>
        </div> */}
        <div className={`text-right`}>
          <button
            className={`btn ${
              isLoading ? 'disabled' : ''
            } btn-primary shadow-sm`}
            onClick={onUpdateSite}
          >
            {isLoading && <Loader className={`mr-2`} />}
            {`UPDATE SITE`}
          </button>
        </div>
      </div>
      <hr className={`m-3`} />
      <h3 className={`px-3`}>{`Info`}</h3>
      <div className={`p-3`}>
        <label className="form-control-label font-weight-bold">{`Crawling & Indexing`}</label>
        <ProgressBar theme={`success`} done={done} total={total} />
      </div>

      <div className={`p-3`}>
        <Search token={token} />
      </div>

      <style jsx>{``}</style>
    </>
  );
};

export { SiteMain };
