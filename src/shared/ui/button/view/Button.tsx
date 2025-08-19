import { useNavigate } from 'react-router-dom';
import styles from './Button.module.scss';
import type { IButtonProps } from '../types/IButtonProps';
import type { FC } from 'react';

export const Button: FC<IButtonProps> = ({
  variant,
  size = '',
  state = 'default',
  disabled = false,
  onClick,
  to,
  href,
  children,
  className,
  type = 'button',
  ariaLabel,
  disabledOnHover = false,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (onClick) {
      onClick(e);
    }

    if (href) {
      window.open(href, '_blank');
      return;
    }

    if (to) {
      navigate(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const uniqClassNames = [
    styles.button,
    styles[variant],
    styles[size],
    styles[state],
    disabled && styles.disabled,
    disabledOnHover && styles.disabledOnHover,
    className && className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <button
      className={uniqClassNames}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
