import React from 'react';

const FieldFileInput = ({ classes, setFieldValue, fileName, ...rest }) => {
  const {
    fileUploadContainer,
    labelClass,
    fileNameClass,
    fileInput,
    clearButton,
  } = classes;
  return (
    <div className={fileUploadContainer}>
      <label htmlFor='fileInput' className={labelClass}>
        Choose file
      </label>
      <span id='fileNameContainer' className={fileNameClass}>
        {fileName}
      </span>
      <input
        {...rest}
        className={fileInput}
        id='fileInput'
        onChange={event => {
          if (event.target.files.length > 0) {
            setFieldValue('file', event.target.files[0]);
            setFieldValue('fileName', event.target.files[0].name);
          } else {
            setFieldValue('file', event.target.files[0]);
            setFieldValue('fileName', '');
          }
        }}
      />
      <div
        className={clearButton}
        onClick={() => {
          setFieldValue('file', null);
          setFieldValue('fileName', null);
        }}
      >
        Clear
      </div>
    </div>
  );
};

export default FieldFileInput;
