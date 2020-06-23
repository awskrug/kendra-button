import { MainContext, ModalContext } from './Context';
import React, {
  Dispatch,
  ReducerAction,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { Site } from '../types';

export type ReducerType =
  | 'reload-site'
  | 'change-site'
  | 'change-theme'
  | 'change-loading-flag'
  | 'change-content';
export interface State {
  theme?: string;
  selectedSite?: Site;
  reloadSite?: boolean;
  loadingFlag?: boolean;
  content?: 'site' | 'settings';
}
export type Action = { type: ReducerType; payload: State };
export type Reducer = (state: State, action: Action) => State;

interface MainConsumer {
  states: State;
  dispatch: Dispatch<ReducerAction<Reducer>>;
}

const initialState: State = {
  theme: 'sandstone',
  reloadSite: true,
  loadingFlag: false,
};

const reducer: Reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'reload-site':
      return {
        ...state,
        reloadSite: payload.reloadSite,
      };
    case 'change-site':
      return {
        ...state,
        selectedSite: payload.selectedSite,
        loadingFlag: false,
        content: 'site',
      };
    case 'change-theme':
      return {
        ...state,
        theme: payload.theme,
      };
    case 'change-loading-flag':
      return {
        ...state,
        loadingFlag: payload.loadingFlag,
      };
    case 'change-content':
      return {
        ...state,
        content: payload.content,
      };
    default:
      return state;
  }
};
const MainProvider = (props) => {
  const [states, dispatch] = useReducer<Reducer>(reducer, initialState);
  // const provider: MainConsumer = { states, dispatch };

  return (
    <MainContext.Provider value={{ states, dispatch }}>
      {props.children}
    </MainContext.Provider>
  );
};

interface ModalProps {
  type: 'plain' | 'site-create';
  cancelBtn?: boolean;
  children?: any;
  display: boolean;
  blockExitOutside?: boolean;
  positionTop?: string;
  title?: string;
  content: any;
  state?: any;
  contentDisplay?: 'header' | 'body' | 'footer';
  okaction?: () => {};
  cancelAction?: () => {};
  hideCloseBtn?: boolean;
}
const ModalProvider = (props) => {
  /**
   * @name modalConfig
   * @description 모달창에 들어가게 될 제목, 내용 및 기타 옵션들
   * @properties
   *  type: 'plain', 'priceplan', ...
      display: true/false
      blockExitOutside: true/false
      title: 제목
      content: 내용
      okaction: 팝업 하단 버튼 눌렀을 때의 Fn
      state: okaction function에 들어갈 argument
   */
  const [modalConfig, setModalConfig] = useState<ModalProps>({
    type: null,
    title: '',
    display: false,
    content: '',
  });
  const keyModalConfig = useMemo(() => ({ modalConfig, setModalConfig }), [
    modalConfig,
  ]);
  const contexts = { ...keyModalConfig };
  return (
    <ModalContext.Provider value={contexts}>
      {props.children}
    </ModalContext.Provider>
  );
};

const useMainContextImpls = (): MainConsumer => useContext(MainContext);
const useModalContextImpls = () => useContext(ModalContext);

const Providers = ({ contexts, children }) =>
  contexts.reduce((Child, Wrapper) => <Wrapper>{Child}</Wrapper>, children);

export {
  MainProvider,
  ModalProvider,
  useMainContextImpls,
  useModalContextImpls,
  Providers,
};
