import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

// passProps la nhung props khac muon truyen vao khac props mac dinh
// truyen className vao de custom rieng nut tai noi ta muon custom nut nao do
// className = {cx('test')}
// 3 type of Button
// 1. noSize: medium
// 2. small
// 3. large
function Button({
  to,
  href,
  onClick,
  children,
  leftIcon,
  rightIcon,
  className = false,
  small = false,
  large = false,
  primary = false,
  gradient = false,
  outline = false,
  text = false,
  disabled = false,
  rounded = false,
  ...passProps
}) {
  let Comp = 'button';

  const props = {
    onClick,
    ...passProps,
  };

  if (to) {
    props.to = to;
  } else if (href) {
    props.href = href;
    Comp = 'a';
  }

  const classes = cx('wrapper', {
    primary,
    gradient,
    outline,
    small,
    large,
    text,
    disabled,
    rounded,
    [className]: className,
  });

  return (
    <Comp className={classes} {...props}>
      {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
      {<span className={cx('title')}>{children}</span>}
      {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </Comp>
  );
}

export default Button;
