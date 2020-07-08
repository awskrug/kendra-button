import { ReactElement, forwardRef, useRef, useState } from 'react';
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  site: string;
  scrapEndpoint: string;
}

const copyCode = ({ setState, ref }) => () => {
  const tempInput = document.createElement('input');
  tempInput.value = ref.current.innerText;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy'); // copy to clipboard
  tempInput.remove();

  setState(true);
  setTimeout(() => {
    setState(false);
  }, 1500);
};

const EmbedInstruction = (props: Props): ReactElement => {
  const { site = '', scrapEndpoint = '' } = props;
  const codeRefOne = useRef(null);
  const codeRefTwo = useRef(null);
  const codeRefThree = useRef(null);
  const [copiedOne, setCopiedOne] = useState(false);
  const [copiedTwo, setCopiedTwo] = useState(false);
  const [copiedThree, setCopiedThree] = useState(false);

  return (
    <>
      <>
        <p>
          Copy and paste this code in your website's{' '}
          <span className={'badge-pill badge-info'}>{`<head>`}</span> tag.
        </p>
        <div className={``}>
          <div
            className={`d-flex justify-content-between align-items-center my-2`}
          >
            <div className={`fa-lg`}>Code: Place in the site's content</div>
            <div
              className={`btn-sm btn-secondary text-nowrap`}
              onClick={copyCode({ setState: setCopiedOne, ref: codeRefOne })}
              role="button"
            >
              <FontAwesomeIcon
                className={`mr-2`}
                icon={copiedOne ? faCheck : faClipboard}
              />
              {copiedOne ? 'copied' : 'copy'}
            </div>
          </div>
          <div
            ref={codeRefOne}
            className={`border border-secondary bg-light rounded p-2 shadow-sm text-primary`}
          >{`
          <script type="text/javascript" src="http://button.kendra.fun/kendra.js?site=${site}&target=#target" defer></script>
        `}</div>
          <div className={`p-2`}>
            <div>
              * <span className={`badge-pill badge-primary`}>target</span> is
              value of <span className={`badge-pill badge-info`}>id</span>{' '}
              (e.g., #target) or{' '}
              <span className={`badge-pill badge-info`}>class</span> (e.g.,
              .target) property of HTML DOM in your{' '}
              <span className={`font-weight-bold`}>"{scrapEndpoint}"</span>{' '}
              website.
            </div>
            <div>
              * Change the{' '}
              <span className={`badge-pill badge-primary`}>target</span> value
              to a value that matches the{' '}
              <span className={`badge-pill badge-info`}>id</span> or{' '}
              <span className={`badge-pill badge-info`}>class</span> prop value
              on your website so you can put your code.
            </div>
          </div>
        </div>
        <div className={``}>
          <div
            className={`d-flex justify-content-between align-items-center my-2`}
          >
            <div className={`fa-lg`}>Code: Place the fixed floating screen</div>
            <div
              className={`btn-sm btn-secondary text-nowrap`}
              onClick={copyCode({ setState: setCopiedTwo, ref: codeRefTwo })}
              role="button"
            >
              <FontAwesomeIcon
                className={`mr-2`}
                icon={copiedTwo ? faCheck : faClipboard}
              />
              {copiedTwo ? 'copied' : 'copy'}
            </div>
          </div>
          <div
            ref={codeRefTwo}
            className={`border border-secondary bg-light rounded p-2 shadow-sm text-primary`}
          >{`
          <script type="text/javascript" src="http://button.kendra.fun/kendra.js?site=${site}&floating=true" defer></script>
        `}</div>
          <div className={`p-2`}>
            <div>
              * <span className={`badge-pill badge-primary`}>floating</span>{' '}
              option can display our service by the fixed floating screen in
              your <span className={`font-weight-bold`}>"{scrapEndpoint}"</span>{' '}
              website.
            </div>
          </div>
        </div>
        <div className={``}>
          <div
            className={`d-flex justify-content-between align-items-center my-2`}
          >
            <div className={`fa-lg`}>
              Code: Place in the site's content and Place the fixed floating
              screen
            </div>
            <div
              className={`btn-sm btn-secondary text-nowrap`}
              onClick={copyCode({
                setState: setCopiedThree,
                ref: codeRefThree,
              })}
              role="button"
            >
              <FontAwesomeIcon
                className={`mr-2`}
                icon={copiedThree ? faCheck : faClipboard}
              />
              {copiedThree ? 'copied' : 'copy'}
            </div>
          </div>
          <div
            ref={codeRefThree}
            className={`border border-secondary bg-light rounded p-2 shadow-sm text-primary`}
          >{`
          <script type="text/javascript" src="http://button.kendra.fun/kendra.js?site=${site}&target=#target&floating=true" defer></script>
        `}</div>
          <div className={`p-2`}>
            <div>
              * this option can display both placing in the site's content and
              place the fixed floating screen in your{' '}
              <span className={`font-weight-bold`}>"{scrapEndpoint}"</span>{' '}
              website.
            </div>
          </div>
        </div>
      </>
      <style jsx>{``}</style>
    </>
  );
};

export { EmbedInstruction };
