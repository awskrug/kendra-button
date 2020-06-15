import { ReactElement, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputProject } from './InputProject';
import { Loader } from './Loader';
import { Site } from '../types';
import { callGraphql } from '../utils';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { siteList } from '../graphql/queries';

interface Props {}

const Projects = (props: Props): ReactElement => {
  const [isNewItem, setIsNewItem] = useState(false);
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    callGraphql({ query: siteList })
      .then((res) => {
        console.log({ res });
        setSites(res?.data?.sites);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setIsLoading(false);
      });
  }, []);

  const addSite = (): void => {
    setIsNewItem(true);
  };

  return (
    <>
      <div className='projects text-white bg-primary mb-3 rounded overflow-auto'>
        <div className='align-items-center d-flex justify-content-between bg-dark'>
          <span className={`py-2 px-3`}>Sites</span>
          <span className={`plusbtn btn btn-secondary`} onClick={addSite}>
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </div>
        <div className='kendra-site-list list-group rounded-0 overflow-auto'>
          {isLoading ? (
            <div className={`d-flex justify-content-center p-3`}>
              <Loader />
            </div>
          ) : (
            sites.map((item) => (
              <a
                key={item.site}
                href='#'
                className='list-group-item list-group-item-action'
              >
                {item.site}
              </a>
            ))
          )}
          {isNewItem && (
            <InputProject setSites={setSites} setIsNewItem={setIsNewItem} />
          )}
        </div>
      </div>
      <style jsx>{`
        .projects {
          box-shadow: 2px 2px 5px 0px grey;
        }
        .kendra-site-list {
          max-height: 90vh;
        }
      `}</style>
    </>
  );
};

export { Projects };
