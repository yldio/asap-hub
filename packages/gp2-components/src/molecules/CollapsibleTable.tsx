import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactNode, useState } from 'react';

const { rem } = pixels;

const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});

const hideStyles = css({
  [`:nth-of-type(n+5)`]: { display: 'none' },
});

export type CollapsibleTableRow = {
  id: string;
  values: (string | ReactNode | undefined)[];
};
type CollapsibleTableProps = {
  headings: JSX.Element;
  children: ReactNode[];
};
const CollapsibleTable: React.FC<CollapsibleTableProps> = ({
  headings,
  children,
}) => {
  const minimumToDisplay = 3;
  const [expanded, setExpanded] = useState(false);

  const getListStyles = () =>
    children.length > minimumToDisplay && !expanded ? [hideStyles] : [];

  return (
    <>
      {headings}
      {children.map((child, idx) => (
        <div css={getListStyles()} key={`table-row-${idx}`}>
          {child}
        </div>
      ))}
      {children.length > minimumToDisplay && (
        <div css={buttonWrapperStyles}>
          <Button linkStyle onClick={() => setExpanded(!expanded)}>
            <span
              css={{
                display: 'inline-grid',
                verticalAlign: 'middle',
                paddingRight: rem(12),
              }}
            >
              {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
            </span>
            Show {expanded ? 'less' : 'more'}
          </Button>
        </div>
      )}
    </>
  );
};
export default CollapsibleTable;
