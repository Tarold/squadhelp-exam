import { useState } from 'react';
import CONSTANTS from '../../dataPages';
import Button from './Button/Button';
import styles from './ButtonGroup.module.sass';

const ButtonGroup = () => {
  const getInitialSelect = CONSTANTS.BUTTON_GROUP_TEXT.map((obj, id) =>
    obj.isSelected ? id : ''
  ).filter(obj => obj)[0];

  const [selectId, setSelectId] = useState(getInitialSelect);

  const buttonMap = (button, id) => (
    <Button
      key={id + 'button'}
      isSelectedId={id === selectId}
      handleClick={() => (id === selectId ? setSelectId('') : setSelectId(id))}
      {...button}
    />
  );
  return (
    <div className={styles.buttonGroup}>
      {CONSTANTS.BUTTON_GROUP_TEXT.map(buttonMap)}
    </div>
  );
};
export default ButtonGroup;
