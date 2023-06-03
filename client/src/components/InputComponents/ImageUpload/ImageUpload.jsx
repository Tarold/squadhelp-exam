import React, { useState } from 'react';
import classNames from 'classnames';

const ImageUpload = props => {
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const [imgLink, setImgLink] = useState(
    props.defaultValue ? props.defaultValue : ''
  );
  const onChange = e => {
    const file = e.target.files[0];
    const imageType = /image.*/;

    if (!file || !file.type.match(imageType)) {
      e.target.value = '';
    } else {
      setImgLink(window.URL.createObjectURL(file));
      props.setFieldValue(props.name, file);
    }
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id='fileInput'
          type='file'
          accept='.jpg, .png, .jpeg'
          onChange={onChange}
        />
        <label htmlFor='fileInput'>Chose file</label>
      </div>
      <img
        id='imagePreview'
        className={classNames({ [imgStyle]: !!props.values[props.name] })}
        alt='user'
        src={imgLink}
      />
    </div>
  );
};

export default ImageUpload;
