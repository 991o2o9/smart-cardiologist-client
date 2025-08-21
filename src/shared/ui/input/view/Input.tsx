/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './Input.module.scss';
import { Typography } from '../../typography/view/Typography';
import classNames from 'classnames';
import { IMaskInput } from 'react-imask';
import type { InputProps } from '../types/InputProps';
import { forwardRef, type ForwardRefRenderFunction, useState } from 'react';
import { Ban, Eye, EyeOff } from 'lucide-react';

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    type = 'text',
    placeholder = '',
    required = false,
    className,
    onChange,
    onBlur,
    id,
    value,
    name,
    error = '',
    disabled = false,
    mask = '',
    alwaysShowMask = false,
    checked = false,
    noHighlight = false,
    label,
  },
  ref,
) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const classNameGenerated = [
    className,
    styles.input,
    error ? styles.inputError : '',
    disabled ? styles.inputDisabled : '',
    isPasswordType ? styles.inputPassword : '',
    noHighlight ? styles.inputNoHighlight : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const getStateClasses = () => {
    if (error) return styles.stateError;
    if (disabled) return styles.stateDisabled;
    return '';
  };

  const handleMaskAccept = (value: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    if (type === 'checkbox') {
      return (
        <div className={styles.checkboxWrapper}>
          <div className={styles.checkboxContainer}>
            <input
              id={id}
              name={name}
              className={classNameGenerated}
              type="checkbox"
              required={required}
              onChange={onChange}
              onBlur={onBlur}
              checked={checked}
              ref={ref}
              disabled={disabled}
            />
            <span className={styles.checkboxCustom}></span>
          </div>
          {label && (
            <label htmlFor={id} className={styles.checkboxLabel}>
              <Typography variant="largeT" color="dark">
                {label}
                {required && <span className={styles.required}>*</span>}
              </Typography>
            </label>
          )}
        </div>
      );
    }

    if (mask) {
      return (
        <IMaskInput
          id={id}
          name={name}
          className={classNameGenerated}
          mask={mask}
          unmask={false}
          lazy={!alwaysShowMask}
          type={inputType}
          placeholder={placeholder}
          required={required}
          onAccept={handleMaskAccept}
          onBlur={onBlur}
          value={value?.toString() || ''}
          disabled={disabled}
          inputRef={ref as any}
        />
      );
    }

    return (
      <input
        id={id}
        name={name}
        className={classNameGenerated}
        type={inputType}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        value={value?.toString() || ''}
        ref={ref}
        disabled={disabled}
      />
    );
  };

  return (
    <div className={styles.wrapper}>
      {label && type !== 'checkbox' && (
        <label htmlFor={id} className={styles.label}>
          <Typography variant="largeT" color="dark">
            {label}
            {required && <span className={styles.required}>*</span>}
          </Typography>
        </label>
      )}
      <div className={classNames(styles.inputContainer, getStateClasses())}>
        {renderInput()}
        {isPasswordType && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <EyeOff width="20" height="20" color="var(--text-sec)" />
            ) : (
              <Eye width="20" height="20" color="var(--text-sec)" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className={styles.errorMsg}>
          <Ban width="15" height="15" color="#F04438" />
          <Typography variant="smallT" color="error">
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};

export const Input = forwardRef(InputComponent);
Input.displayName = 'Input';
