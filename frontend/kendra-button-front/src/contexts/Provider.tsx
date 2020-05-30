import { ApplyFormContext, CompInfoContext, MainContext, ModalContext } from './Context'
import React, { useContext, useMemo, useReducer, useState } from 'react'

export interface State {
  theme?: string;
}
type Action = { type: ActionType.SetUser; payload: State };
type Reducer = (state: State, action: Action) => State;

const reducer: Reducer = (state, action) => {
  const { type, payload } = action
  console.log('reducer', { type, payload })
  switch (type) {
    case 'change-theme':
      return {
        ...state,
        theme: payload.theme,
      };
    default:
      return state;
  }
}
const MainProvider = props => {
  const [states, dispatch] = useReducer<Reducer>(reducer, { theme: 'minty' })

  return <MainContext.Provider value={{ states, dispatch }}>{props.children}</MainContext.Provider>
}

const ModalProvider = props => {
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
  const [modalConfig, setModalConfig] = useState({
    title: '',
    display: false,
    content: '',
  })
  const keyModalConfig = useMemo(() => ({ modalConfig, setModalConfig }), [modalConfig])
  const contexts = { ...keyModalConfig }
  return <ModalContext.Provider value={contexts}>{props.children}</ModalContext.Provider>
}

const useMainContextImpls = () => useContext(MainContext)
const useModalContextImpls = () => useContext(ModalContext)

const Providers = ({ contexts, children }) =>
  contexts.reduce((Child, Wrapper) => <Wrapper>{Child}</Wrapper>, children)

export {
  MainProvider,
  ModalProvider,
  useMainContextImpls,
  useModalContextImpls,
  Providers,
}
