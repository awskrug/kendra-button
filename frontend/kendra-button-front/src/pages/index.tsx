import { Action, useMainContextImpls } from '../contexts'
import { useCallback, useState } from 'react';

import Link from 'next/link';

type stateBtype = string | number;
interface BText {
  text: string;
  currentTheme: string;
  theme: string;
  dispatch: React.Dispatch<Action>;
}

const Button = (props: BText) => {
  const { text, currentTheme, theme, dispatch } = props;
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
  const btnBgClass = theme === currentTheme ? 'btn-primary' : 'btn-dark'
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
        <Button dispatch={dispatch} currentTheme={states.theme} theme={'minty'} text={'minty theme'} />
        <Button dispatch={dispatch} currentTheme={states.theme} theme={'cyborg'} text={'cyborg theme'} />
        <Button dispatch={dispatch} currentTheme={states.theme} theme={'cerulean'} text={'cerulean theme'} />
        <Button dispatch={dispatch} currentTheme={states.theme} theme={'cosmo'} text={'cosmo theme'} />
      </div>
      <Link href='/admin'>
        <a>Go To Admin Page</a>
      </Link>
    </>
  );
};

export default Index;
