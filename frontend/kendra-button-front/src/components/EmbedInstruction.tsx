import { ReactElement, useRef, useState } from 'react';
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  site: string;
  scrapEndpoint: string;
}
const EmbedInstruction = (props: Props): ReactElement => {
  const { site = '', scrapEndpoint = '' } = props;
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    const tempInput = document.createElement('input');
    tempInput.value = codeRef.current.innerText;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy'); // copy to clipboard
    tempInput.remove();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <>
        <p>
          Copy and paste this code in your website's{' '}
          <span className={'badge-pill badge-info'}>{`<head>`}</span> tag.
        </p>
        <div
          className={`d-flex justify-content-between align-items-center my-2`}
        >
          <div className={`fa-lg`}>Code</div>
          <div
            className={`btn-sm btn-secondary`}
            onClick={copyCode}
            role="button"
          >
            <FontAwesomeIcon
              className={`mr-2`}
              icon={copied ? faCheck : faClipboard}
            />
            {copied ? 'copied' : 'copy'}
          </div>
        </div>
        <div
          ref={codeRef}
          className={`border border-secondary bg-light rounded p-2 shadow-sm text-primary`}
        >{`
          <script type="text/javascript" src="kendra-nav.js?id=${site}&target=#target" defer></script>
        `}</div>
        <div className={`p-2`}>
          <div>
            * <span className={`badge-pill badge-primary`}>target</span> is
            value of <span className={`badge badge-info`}>id</span> (e.g.,
            #target) or <span className={`badge badge-info`}>class</span> (e.g.,
            .target) prop of HTML DOM in your{' '}
            <span className={`font-weight-bold`}>"{scrapEndpoint}"</span>{' '}
            website.
          </div>
          <div>
            * Change the{' '}
            <span className={`badge-pill badge-primary`}>target</span> value to
            a value that matches the{' '}
            <span className={`badge badge-info`}>id</span> or{' '}
            <span className={`badge badge-info`}>class</span> prop value on your
            website so you can put your code.
          </div>
        </div>
      </>
      <style jsx>{``}</style>
    </>
  );
};

export { EmbedInstruction };
