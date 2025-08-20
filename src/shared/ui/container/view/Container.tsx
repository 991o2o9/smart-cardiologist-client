import type { FC } from 'react';
import type { IContainerProps } from '../types/IContainerProps';
import styles from './Container.module.scss';
import classNames from 'classnames';

export const Container: FC<IContainerProps> = ({
  children,
  className,
  header,
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        header && styles.headerContainer,
        className,
      )}
    >
      {children}
    </div>
  );
};
