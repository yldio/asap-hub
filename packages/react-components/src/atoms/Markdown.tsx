import { useMemo } from 'react';
import MarkdownJSX from 'markdown-to-jsx';
import DOMPurify from 'dompurify';

function MarkdownLink(props: {
  href: string;
  title: string;
  className?: string;
  children: any;
}) {
  const { children, ...rest } = props;

  return (
    <a {...rest} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const Markdown = ({ value }: { value: string }) => {
  // See the list of allowed Tags here:
  // https://github.com/cure53/DOMPurify/blob/main/src/tags.js#L3-L121
  const cleanHTML = useMemo(() => {
    return DOMPurify.sanitize(value);
  }, [value]);

  return (
    <MarkdownJSX
      options={{
        overrides: {
          a: {
            component: MarkdownLink as any,
          },
        },
      }}
    >
      {cleanHTML}
    </MarkdownJSX>
  );
};

export default Markdown;
