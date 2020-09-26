import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  ReactElement,
  SetStateAction,
  useRef,
} from 'react';
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Logger } from 'aws-amplify';
import { Site } from '../types';
import { callGraphql } from '../utils';
import { createSite } from '../graphql/queries';

const logger = new Logger('InputProject');

interface Props {
  setSites: Dispatch<SetStateAction<Array<Site>>>;
  setIsNewItem: Dispatch<SetStateAction<boolean>>;
}
interface ResCreateSite {
  createSite: {
    site: Site;
  };
}

const InputProject = (props: Props): ReactElement => {
  const { setSites, setIsNewItem } = props;
  const siteName = useRef(null);

  const onChangeSiteName = (e: ChangeEvent<HTMLInputElement>): void => {
    siteName.current = e.target.value;
  };

  const addProject = async (e: MouseEvent<SVGSVGElement>): Promise<void> => {
    logger.log('siteName', siteName);
    const res: GraphQLResult<ResCreateSite> = await callGraphql({
      query: createSite,
      variables: {
        site: siteName.current,
        title: siteName.current,
        url: ' ',
      },
    });
    logger.log('result', res);
    if (res.errors) {
      return;
    }
    setIsNewItem(false);
    setSites((site) => {
      return [...site, res.data.createSite.site];
    });
  };

  const cancelAddProject = async (
    e: MouseEvent<SVGSVGElement>,
  ): Promise<void> => {
    logger.log('cancel');
    setIsNewItem(false);
    siteName.current = null;
  };
  return (
    <>
      <div className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-2">
        <input
          type="text"
          className="form-control"
          id="input-url"
          placeholder={`input site name`}
          onChange={onChangeSiteName}
        />
        <FontAwesomeIcon
          className={`ml-2 fa-lg`}
          icon={faCheckCircle}
          role="button"
          onClick={addProject}
        />
        <FontAwesomeIcon
          className={`ml-2 fa-lg`}
          icon={faTimesCircle}
          role="button"
          onClick={cancelAddProject}
        />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export { InputProject };
