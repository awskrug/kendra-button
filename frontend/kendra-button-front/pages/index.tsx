import {
  AmplifySignOut,
  AmplifySignUp,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { useCallback, useState } from 'react';

type stateBtype = string | number;
interface BText {
  text: string;
  state: any;
  stateB: stateBtype;
}

const Button = (props: BText) => {
  const { text, state, stateB } = props;
  const btnOnClick = useCallback(
    (e: any) => {
      alert('button clicked!' + stateB);
    },
    [state],
  );
  return (
    <>
      <button className={'btn'} onClick={btnOnClick}>
        {text}
      </button>
      {/* css in js */}
      <style jsx>{`
        .btn {
          padding: 1rem;
        }
      `}</style>
    </>
  );
};

const Index = (props) => {
  console.log({ props });
  const [state, setState] = useState(null);
  const [stateB, setStateB] = useState<stateBtype>(null);
  return (
    <>
      <h1>Nice to meet ya!</h1>
      <h2>This is Kendra-Frontend</h2>
      <p id='cool'>Cool!</p>
      <Button text={'this is button'} state={state} stateB={stateB} />
      <style jsx>{`
        #cool {
          background-color: orange;
        }
      `}</style>
    </>
  );
};

// export default Index

const App = () => (
  <div>
    <AmplifySignOut />
    My App
  </div>
);

export default App
