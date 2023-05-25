import classNames from 'classnames';
import styles from './Button.module.sass';

const Button = ({ label, text, isSelectedId, handleClick }) => {
  const buttonStyle = classNames(styles.buttonContainer, {
    [styles.selected]: isSelectedId,
  });

  return (
    <div className={buttonStyle} onClick={handleClick}>
      <span className={styles.label}>{label}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default Button;
