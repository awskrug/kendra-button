import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
  list: string[];
}

const Projects = (props: Props): ReactElement => {
  const { list } = props;

  return (
    <>
      <div className='projects text-white bg-primary mb-3 rounded overflow-auto'>
        <div className='align-items-center d-flex justify-content-between bg-dark'>
          <span className={`py-2 px-3`}>Sites</span>
          <span className={`plusbtn btn btn-secondary`}>
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </div>
        <div className='list-group rounded-0'>
          {list.map((item) => (
            <a
              key={item}
              href='#'
              className='list-group-item list-group-item-action'
            >
              {item}
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        .projects {
          box-shadow: 2px 2px 5px 0px grey;
        }
      `}</style>
    </>
  );
};

export { Projects };
