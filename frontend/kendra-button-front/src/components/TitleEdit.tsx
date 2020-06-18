// import * as Yup from 'yup';

import { ReactElement } from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';

// import { useFormik } from 'formik';

interface Props {
  title: string;
}
const TitleEdit = (props: Props): ReactElement => {
  const { title = 'Site' } = props || {};
  // const [isEditMode, setIsEditMode] = useState(false);

  // const formik = useFormik({
  //   initialValues: {
  //     title: '',
  //   },
  //   validationSchema: Yup.object({
  //     title: Yup.string().required(`"Title"은 필수 입력 항목입니다.`),
  //   }),
  //   onSubmit: () => {},
  // });

  // const onEditStart = (): void => {};

  return (
    <>
      <div
        className={`h3 px-3 d-flex justify-content-between align-items-center`}
      >
        {title}
        {/* {isEditMode ? (
          title
        ) : (
          // <input
          //   type="text"
          //   className="form-control"
          //   id="input-title"
          //   placeholder={`input title`}
          //   defaultValue={title}
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

export { TitleEdit };
