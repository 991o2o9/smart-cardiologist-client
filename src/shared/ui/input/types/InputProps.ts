export interface InputProps {
  type?: 'text' | 'number' | 'email' | 'tel' | 'checkbox' | 'password';
  placeholder?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  id?: string;
  value?: string | number | boolean;
  name?: string;
  error?: string;
  disabled?: boolean;
  mask?: string;
  alwaysShowMask?: boolean;
  checked?: boolean;
  label?: string;
}
