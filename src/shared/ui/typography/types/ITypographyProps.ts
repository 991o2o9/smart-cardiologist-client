import type { ReactNode } from 'react';

export interface TypographyProps {
  variant: Variant;
  weight?: Weight;
  children: ReactNode;
  className?: string;
  color?: Color;
  truncate?: boolean | number;
  isParsed?: boolean;
}

export type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'largeT'
  | 'bodyT'
  | 'smallT'
  | 'extraSmallT'
  | 'buttonT'
  | 'madeByGeeks';

export type Weight = 'bold' | 'semiBold' | 'medium' | 'regular';

export type Color =
  | 'dark'
  | 'white'
  | 'light-blue'
  | 'gray'
  | 'dark-blue'
  | 'error'
  | 'ocean-blue'
  | 'success'
  | 'moreGray';
