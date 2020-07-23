import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { siteItem, siteList } from '../graphql/queries';
import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from './Loader';
import { callGraphql } from '../utils';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {}

const Projects = (props: Props): ReactElement => {
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { states, dispatch } = useMainContextImpls();
  const { setModalConfig } = useModalContextImpls();

  useEffect(() => {
    if (!states.reloadSite) return;
    callGraphql({ query: siteList })
      .then((res) => {
        console.log('200', JSON.stringify(res, null, 2));
        setSites(res?.data?.sites);
        setIsLoading(false);
        dispatch({
          type: 'reload-site',
          payload: {
            reloadSite: false,
          },
        });
      })
      .catch((err) => {
        console.log('400', JSON.stringify(err, null, 2));
        setIsLoading(false);
      });
  }, [states.reloadSite]);

  const addSite = (): void => {
    setModalConfig({
      type: 'site-create',
      display: true,
      title: 'Create new site',
      positionTop: '10%',
    });
  };

  const setSelectedSite = async (
    e: MouseEvent<HTMLDivElement>,
  ): Promise<void> => {
    const target = e.target as HTMLDivElement;

    dispatch({
      type: 'change-loading-flag',
      payload: {
        loadingFlag: true,
      },
    });
    const res = await callGraphql({
      query: siteItem,
      variables: { site: target.innerText },
    });
    dispatch({
      type: 'change-site',
      payload: {
        selectedSite: res.data.site,
      },
    });
  };

  return (
    <>
      <div className="projects text-white bg-primary mb-3 rounded overflow-auto">
        <div className="align-items-center d-flex justify-content-between bg-dark">
          <span className={`py-2 px-3`}>Sites</span>
          <span className={`plusbtn btn btn-secondary`} onClick={addSite}>
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </div>
        <div className="kendra-site-list list-group rounded-0 overflow-auto">
          {isLoading ? (
            <div className={`d-flex justify-content-center p-3`}>
              <Loader />
            </div>
          ) : (
            sites.map((item) => (
              <div
                key={item.site}
                className={`list-group-item list-group-item-action`}
                role={`button`}
                onClick={setSelectedSite}
              >
                {item.site}
              </div>
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        .projects {
          box-shadow: 2px 2px 5px 0px grey;
        }
        .kendra-site-list {
          max-height: 65vh;
        }
      `}</style>
    </>
  );
};

export { Projects };
