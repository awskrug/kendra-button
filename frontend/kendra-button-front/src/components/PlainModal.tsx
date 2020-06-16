import { MouseEvent, ReactElement } from 'react';

import { useModalContextImpls } from '../contexts';

const PlainModal = (): ReactElement => {
  const { modalConfig, setModalConfig } = useModalContextImpls();
  const {
    type,
    cancelBtn,
    children,
    display,
    blockExitOutside,
    positionTop,
    title,
    content,
    state,
    contentDisplay = ['header', 'body', 'footer'],
    okaction,
    cancelAction,
    hideCloseBtn,
  } = modalConfig;
  const isMe = (type === 'plain' || !type) && display;
  if (!isMe) {
    return null;
  }
  const hideModal = () => {
    setModalConfig((state) => ({
      ...modalConfig,
      display: false,
    }));
  };
  const okBtnInlineFn = (e) => {
    if (state && okaction) {
      okaction(state, hideModal);
    } else {
      hideModal();
    }
  };
  const cancelBtnInlineFn = (e) => {
    if (state && cancelAction) {
      cancelAction(state, hideModal);
      hideModal();
    } else {
      hideModal();
    }
  };
  // example: { header: 'header', body: 'body', footer: 'footer' }
  const displayContent = contentDisplay.reduce((prev, curr) => {
    prev[curr] = true;
    return prev;
  }, {});
  return (
    <div
      className={isMe ? 'modal overflow-auto visible' : 'modal invisible'}
      id="plain-outer"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.id === 'plain-outer' && !blockExitOutside && hideModal();
      }}
    >
      <div
        className="modal-dialog"
        role="document"
        style={{ top: positionTop || '20%' }}
      >
        <div className="modal-content">
          {displayContent.header && (
            <div className="modal-header">
              <h5 className="modal-title">{modalConfig ? title : ''}</h5>
              {!hideCloseBtn && (
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hideModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
          )}
          {displayContent.body && (
            <div className="modal-body">
              <div>{modalConfig ? content : ''}</div>
            </div>
          )}
          {displayContent.footer && (
            <div className="modal-footer">
              {children}
              {!children && !cancelBtn && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={okBtnInlineFn}
                  >
                    확인
                  </button>
                </>
              )}
              {!children && cancelBtn && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={okBtnInlineFn}
                  >
                    확인
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelBtnInlineFn}
                  >
                    취소
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        #plain-outer {
          background-color: rgba(0, 0, 0, 0.5);
          transition: visibility 0s, opacity 0.15s linear;
          display: block;
          opacity: ${isMe ? 1 : 0};
        }
      `}</style>
    </div>
  );
};

export { PlainModal };
