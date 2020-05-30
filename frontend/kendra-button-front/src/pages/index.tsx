import { useCallback, useState } from 'react';

import Link from 'next/link';
import { useMainContextImpls } from '../contexts'

type stateBtype = string | number;
interface BText {
  text: string;
  state: any;
  stateB: stateBtype;
}

const Button = (props: BText) => {
  const { text, theme, stateB, dispatch } = props;
  const btnOnClick = useCallback(
    (e: any) => {
      console.log('button theme', theme)
      dispatch({
        type: 'change-theme',
        payload: { theme },
      })
    },
    [theme],
  );
  const btnBgClass = theme === 'minty' ? 'btn-primary' : 'btn-dark'
  return (
    <>
      <button className={'btn ' + btnBgClass} onClick={btnOnClick}>
        {text}
      </button>
      {/* css in js */}
      <style jsx>{`
        .btn {
          padding: 1rem;
          margin: 1rem;
        }
      `}</style>
    </>
  );
};

const Index = (props) => {
  const { states, dispatch } = useMainContextImpls();
  const [state, setState] = useState(null);
  const [stateB, setStateB] = useState<stateBtype>(null);
  return (
    <>
      <h1>This is Kendra-Frontend</h1>
      <div>
        <Button dispatch={dispatch} theme={'minty'} text={'minty theme'} />
        <Button dispatch={dispatch} theme={'cyborg'} text={'cyborg theme'} />
      </div>
      <Link href='/admin'>
        <a>Go To Admin Page</a>
      </Link>
    </>
  );
};

export default Index;
