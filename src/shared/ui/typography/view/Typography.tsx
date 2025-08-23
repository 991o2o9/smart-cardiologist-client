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

  const parseHTMLContent = (content: string) => {
    // Заменяем HTML-entities
    let parsedContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ');

    // Заменяем <br> теги на переносы строк
    parsedContent = parsedContent.replace(/<br\s*\/?>/gi, '\n');

    // Проверяем, содержит ли контент таблицу
    if (parsedContent.includes('\t') || parsedContent.includes('|')) {
      return renderTable(parsedContent);
    }

    // Разбиваем на параграфы и обрабатываем каждый
    const paragraphs = parsedContent.split('\n\n').filter((p) => p.trim());

    return (
      <div className={styles.parsedContent}>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className={styles.paragraph}>
            {paragraph.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className={styles.line}>
                {line.trim() && (
                  <span className={styles.lineText}>
                    {parseMarkdownText(line.trim())}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const parseMarkdownText = (text: string) => {
    // Обрабатываем жирный текст **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Убираем звездочки и делаем текст жирным
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className={styles.boldText}>
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  const renderTable = (content: string) => {
    const lines = content.split('\n').filter((line) => line.trim());
    const tableData: string[][] = [];

    lines.forEach((line) => {
      // Разбиваем строку по табуляции или вертикальной черте
      const cells = line
        .split(/\t|\|/)
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      if (cells.length > 1) {
        tableData.push(cells);
      }
    });

    if (tableData.length === 0) {
      return <span>{content}</span>;
    }

    return (
      <div className={styles.tableWrapper}>
        <table className={styles.parsedTable}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  rowIndex === 0 ? styles.tableHeader : styles.tableRow
                }
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      rowIndex === 0 ? styles.tableHeaderCell : styles.tableCell
                    }
                  >
                    {parseMarkdownText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getContent = () => {
    if (!children) return null;

    if (truncate && typeof children === 'string') {
      return truncateString(children, truncate as number);
    }

    if (isParsed && typeof children === 'string') {
      // Проверяем, содержит ли контент HTML-теги или таблицы
      if (
        children.includes('<br') ||
        children.includes('\t') ||
        children.includes('|') ||
        children.includes('&lt;')
      ) {
        return parseHTMLContent(children);
      }

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
