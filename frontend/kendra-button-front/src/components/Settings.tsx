import { ReactElement } from 'react';

interface Props {}
const Settings = (props: Props): ReactElement => {
  return (
    <>
      <div
        className={`align-items-center d-flex justify-content-between pb-1 p-3`}
      >
        <div className="card text-white bg-primary mb-3">
          <div className="card-header">계정 정보 수정</div>
          <div className="card-body">
            <h4 className="card-title">계정 정보 수정</h4>
            <p className="card-text">계정 정보 수정</p>
          </div>
        </div>
      </div>
      <div
        className={`align-items-center d-flex justify-content-between pb-1 p-3`}
      >
        <div className="card text-white bg-secondary mb-3">
          <div className="card-header">계정 탈퇴</div>
          <div className="card-body">
            <h4 className="card-title">계정 탈퇴</h4>
            <p className="card-text">정말? 가게?</p>
          </div>
        </div>
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export { Settings };
