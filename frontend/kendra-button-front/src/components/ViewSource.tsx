import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactElement } from 'react';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

interface Props {
  text?: string;
  alt?: boolean;
  size?: 'small' | 'medium' | 'large';
}
const githubLink = 'https://github.com/awskrug/kendra-button';
const ViewSource = (props: Props): ReactElement => {
  const { text, alt, size = 'medium' } = props;
  const sizeClass =
    size === 'small' ? `fa-sm` : size === 'medium' ? `fa-2x` : `fa-3x`;

  const viewSource = (): void => {
    window.open(githubLink, '_blank');
  };
  const faPropIcon = faGithub as IconProp;
  return (
    <>
      <div
        className={`viewsource align-items-center d-flex justify-content-center my-3`}
        role="button"
        onClick={viewSource}
      >
        <FontAwesomeIcon icon={faPropIcon} className={sizeClass} />
        {text && <span className={`ml-2`}>{text}</span>}
      </div>
      <style jsx>{`
        .viewsource {
          color: ${alt ? '#000' : '#f8f5f0'};
        }
        .viewsource:hover {
          color: ${alt ? '#999' : '#cecece'};
        }
      `}</style>
    </>
  );
};
export { ViewSource };
