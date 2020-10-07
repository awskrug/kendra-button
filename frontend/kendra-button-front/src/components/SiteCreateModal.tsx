import * as Yup from 'yup';

import { ReactElement, useState } from 'react';
import { callGraphql, regDomain } from '../utils';
import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Logger } from 'aws-amplify';
import ReactTooltip from 'react-tooltip';
import { Site } from '../types';
import { createSite } from '../graphql/queries';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';

const logger = new Logger('SiteCreateModal');

interface ResCreateSite {
  createSite: {
    site: Site;
  };
}
const SiteCreateModal = (): ReactElement => {
  const { modalConfig, setModalConfig } = useModalContextImpls();
  const { dispatch } = useMainContextImpls();

  const [loading, setLoading] = useState(null);

  const formik = useFormik({
    initialValues: {
      site: '',
      url: '',
      domain: '',
      term: 'd',
    },
    validationSchema: Yup.object({
      site: Yup.string().required(`"Title" is a required field`),
      url: Yup.string()
        .url(`invalid url address`)
        .required(`"url" is a required field`),
      domain: Yup.string().required(`"domain" is a required field`),
      term: Yup.string().required(`"term" is a required field`),
    }),
    onSubmit: () => {},
  });
  const {
    type,
    display,
    positionTop,
    title,
    state,
    contentDisplay = ['header', 'body'],
    okaction,
    hideCloseBtn,
  } = modalConfig;
  const isMe = (type === 'site-create' || !type) && display;
  if (!isMe) {
    return null;
  }

  const hideModal = (): void => {
    setModalConfig((state) => ({
      ...modalConfig,
      display: false,
    }));
  };

  const closeModal = (): void => {
    formik.resetForm();
    hideModal();
  };

  const onSubmit = async (): Promise<void> => {
    if (loading) return;
    formik.submitForm();
    if (!formik.isValid) {
      return;
    }
    const domainFromUrl = formik.values.url.match(regDomain);
    const domainFromDomain = formik.values.domain.match(regDomain);

    logger.log({
      domainFromUrl,
      domainFromDomain,
      formikdomain: formik.values.domain,
    });

    if (!domainFromUrl || domainFromUrl.length < 2) {
      formik.setFieldError('url', 'invalid url');
      return;
    }

    setLoading(true);

    try {
      const res: GraphQLResult<ResCreateSite> = await callGraphql({
        query: createSite,
        variables: {
          site: formik.values.site,
          scrapEndpoint: formik.values.url,
          domain: formik.values.domain,
          term: formik.values.term,
        },
      });

      formik.resetForm();

      logger.log('onSubmit', res);
      dispatch({
        type: 'reload-site',
        payload: {
          reloadSite: true,
        },
      });

      if (okaction) {
        okaction(state);
      }
      setLoading(false);
      hideModal();
    } catch (e) {
      logger.log(e);
      setLoading(false);
      if (e.errors && e.errors[0]) {
        formik.setErrors({ site: e.errors[0].message });
      }
    }
  };

  // example: { header: 'header', body: 'body', footer: 'footer' }
  const displayContent = contentDisplay.reduce((prev, curr) => {
    prev[curr] = true;
    return prev;
  }, {});
  return (
    <div
      className={isMe ? 'modal overflow-auto visible' : 'modal invisible'}
      id="plain-outer"
    >
      <div
        className="modal-dialog"
        role="document"
        style={{ top: positionTop || '20%' }}
      >
        <div className="modal-content">
          {displayContent.header && (
            <div className="modal-header">
              <h5 className="modal-title">{modalConfig ? title : ''}</h5>
              {!hideCloseBtn && (
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
          )}
          {displayContent.body && (
            <div className="modal-body">
              <div className="form-group">
                <label
                  className="form-control-label font-weight-bold"
                  htmlFor="input-site"
                >{`Site Name`}</label>
                <FontAwesomeIcon
                  className={`mx-2`}
                  icon={faInfoCircle}
                  role="button"
                  data-tip
                  data-for="siteNameTip"
                />
                <ReactTooltip id="siteNameTip" place="right" effect="solid">
                  Name of website to register
                </ReactTooltip>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.site && formik.errors.site
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="input-site"
                  name="site"
                  placeholder={`Input site name`}
                  value={formik.values.site}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.site && formik.errors.site && (
                  <div className="invalid-feedback">{formik.errors.site}</div>
                )}
              </div>
              <div className="form-group">
                <label
                  className="form-control-label font-weight-bold"
                  htmlFor="input-url"
                >{`Crawling URL`}</label>
                <FontAwesomeIcon
                  className={`mx-2`}
                  icon={faInfoCircle}
                  role="button"
                  data-tip
                  data-for="crawlingTip"
                />
                <ReactTooltip id="crawlingTip" place="right" effect="solid">
                  Target to crawl
                </ReactTooltip>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.url && formik.errors.url ? 'is-invalid' : ''
                  }`}
                  id="input-url"
                  name="url"
                  placeholder={`Input crawling url`}
                  value={formik.values.url}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.url && formik.errors.url && (
                  <div className="invalid-feedback">{formik.errors.url}</div>
                )}
              </div>
              <div className="form-group">
                <label
                  className="form-control-label font-weight-bold"
                  htmlFor="input-domain"
                >{`Domain`}</label>
                <FontAwesomeIcon
                  className={`mx-2`}
                  icon={faInfoCircle}
                  role="button"
                  data-tip
                  data-for="domainTip"
                />
                <ReactTooltip id="domainTip" place="right" effect="solid">
                  Website URL that you'd like to embed Kendra Button
                </ReactTooltip>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.domain && formik.errors.domain
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="input-domain"
                  name="domain"
                  placeholder={`Input domain`}
                  value={formik.values.domain}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.domain && formik.errors.domain && (
                  <div className="invalid-feedback">{formik.errors.domain}</div>
                )}
              </div>
              <div className="form-group">
                <label
                  className="form-control-label font-weight-bold"
                  htmlFor="select-term"
                >{`Crawl/Index Term`}</label>
                <FontAwesomeIcon
                  className={`mx-2`}
                  icon={faInfoCircle}
                  role="button"
                  data-tip
                  data-for="crawlTermTip"
                />
                <ReactTooltip id="crawlTermTip" place="right" effect="solid">
                  How frequently would you like to re-crawl your website?
                </ReactTooltip>
                <select
                  className="custom-select"
                  id="select-term"
                  name="term"
                  defaultValue={formik.values.term}
                  onChange={formik.handleChange}
                >
                  <option value={`d`}>{`Daily`}</option>
                  <option value={`h`}>{`Hourly`}</option>
                </select>
              </div>
              <div className={`d-flex justify-content-end`}>
                <button
                  className={`btn btn-primary shadow-sm`}
                  onClick={onSubmit}
                >
                  {loading ? `loading...` : `Create Site`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        #plain-outer {
          background-color: rgba(0, 0, 0, 0.5);
          transition: visibility 0s, opacity 0.15s linear;
          display: block;
          opacity: ${isMe ? 1 : 0};
        }
      `}</style>
    </div>
  );
};

export { SiteCreateModal };
