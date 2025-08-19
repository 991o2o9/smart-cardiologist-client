import type { ReactNode } from 'react';

export interface IButtonProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  to?: string;
  disabledOnHover?: boolean;
  ariaLabel?: string;
  href?: string;
}

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'slider'
  | 'tertiary-dark';

export type ButtonSize = 'small' | 'medium' | 'large' | 'fullWidth';

export type ButtonState = 'default' | 'hover' | 'click' | 'disabled';
