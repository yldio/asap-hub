import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  Subtitle,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactNode, useState } from 'react';
import { mobileQuery, nonMobileQuery } from '../layout';
import colors from '../templates/colors';

const { rem } = pixels;

const rowStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  padding: `${rem(16)} 0 ${rem(12)}`,
  rowGap: rem(32),
  [nonMobileQuery]: {
    gridTemplateColumns: '1fr 196px 156px',
    columnGap: `${rem(24)}`,
    rowGap: 0,
  },
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
});

const gridTitleStyles = css({
  borderBottom: 'none',
  marginBottom: 0,
  paddingBottom: 0,
  [mobileQuery]: {
    display: 'none',
  },
});

const headingListStyles = css({
  [nonMobileQuery]: {
    display: 'none',
  },
});

const hideStyles = css({
  [`:nth-of-type(n+5)`]: { display: 'none' },
});

const secondaryTextStyles = css({
  color: colors.greyscale1000.rgb,
});

const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});

type CollapsibleTableRow = {
  id: string;
  values: (string | ReactNode | undefined)[];
};
type CollapsibleTableProps = {
  headings: string[];
  children: CollapsibleTableRow[];
};
const CollapsibleTable: React.FC<CollapsibleTableProps> = ({
  headings,
  children,
}) => {
  const minimumToDisplay = 3;
  const [expanded, setExpanded] = useState(false);

  const getListStyles = () =>
    children.length <= minimumToDisplay || expanded
      ? rowStyles
      : [rowStyles, hideStyles];

  const getTextStyles = (idx: number) => (idx === 0 ? [] : secondaryTextStyles);
  return (
    <>
      <div css={[rowStyles, gridTitleStyles]}>
        {headings.map((heading, idx) => (
          <Subtitle key={`heading-${idx}`}>{heading}</Subtitle>
        ))}
      </div>
      {children.map(({ id, values }, index) => (
        <div key={`display-row-${id}-${index}`} css={getListStyles()}>
          {values.map((value, idx) => (
            <div
              key={`display-row-value-${idx}`}
              css={css({
                display: 'flex',
                gap: rem(16),
                flexDirection: 'column',
              })}
            >
              {value && (
                <>
                  <div css={headingListStyles}>
                    <Subtitle noMargin styleAsHeading={5}>
                      {headings[idx]}:
                    </Subtitle>
                  </div>
                  <span css={getTextStyles(idx)}>{value}</span>
                </>
              )}
            </div>
          ))}
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
