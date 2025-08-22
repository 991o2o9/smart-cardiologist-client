import styles from './Typography.module.scss';
import type { TypographyProps } from '../types/ITypographyProps';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Tags = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  largeT: 'p',
  bodyT: 'p',
  smallT: 'p',
  extraSmallT: 'p',
  buttonT: 'p',
  madeByGeeks: 'p',
} as const;

export const Typography: FC<TypographyProps> = ({
  variant,
  weight,
  children,
  className,
  color,
  truncate = false,
  isParsed = false,
}) => {
  const uniqClassNames = [
    styles[variant],
    weight && styles[weight],
    color && styles[color],
    className && className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const truncateString = (str: string, maxNumber: number) => {
    return str.length <= maxNumber ? str : str.slice(0, maxNumber) + '...';
  };

  const getContent = () => {
    if (!children) return null;

    if (truncate && typeof children === 'string') {
      return truncateString(children, truncate as number);
    }

    if (isParsed && typeof children === 'string') {
      return (
        <div className={uniqClassNames}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
      );
    }

    return children;
  };

  const TagName = isParsed ? 'div' : Tags[variant] || 'p';

  return <TagName className={uniqClassNames}>{getContent()}</TagName>;
};
