// import * as Yup from 'yup';

import { ReactElement } from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';

// import { useFormik } from 'formik';

interface Props {
  site: string;
}
const SiteEdit = (props: Props): ReactElement => {
  const { site = 'Site' } = props || {};
  // const [isEditMode, setIsEditMode] = useState(false);

  // const formik = useFormik({
  //   initialValues: {
  //     site: '',
  //   },
  //   validationSchema: Yup.object({
  //     site: Yup.string().required(`"Title"은 필수 입력 항목입니다.`),
  //   }),
  //   onSubmit: () => {},
  // });

  // const onEditStart = (): void => {};

  return (
    <>
      <div
        className={`h3 px-3 d-flex justify-content-between align-items-center`}
      >
        {site}
        {/* {isEditMode ? (
          site
        ) : (
          // <input
          //   type="text"
          //   className="form-control"
          //   id="input-site"
          //   placeholder={`input site`}
          //   defaultValue={site}
          //   disabled
          // />
        )} */}
        {/* <FontAwesomeIcon
          className={`shadow-sm rounded-circle`}
          icon={faEdit}
          role={'button'}
          onClick={onEditStart}
        /> */}
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export { SiteEdit };
