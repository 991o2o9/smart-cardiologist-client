import type { ReactNode } from 'react';

export interface IContainerProps {
  children: ReactNode;
  className?: string;
  header?: boolean;
}
