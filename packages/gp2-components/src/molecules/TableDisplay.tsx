import {
  Button,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
  Headline4,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { useState } from 'react';
import { nonMobileQuery } from '../layout';
import colors from '../templates/colors';

const { rem } = pixels;

const contentStyles = css({
  padding: `${rem(16)} 0 ${rem(20)}`,
});
const rowStyles = css({
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: rem(12),
  padding: `${rem(16)} 0 ${rem(12)}`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
  [nonMobileQuery]: {
    display: 'flex',
  },
});
const hideStyles = css({
  [`:nth-of-type(n+6)`]: { display: 'none' },
});
const headingTopStyles = css({
  display: 'none',
  [nonMobileQuery]: {
    display: 'flex',
  },
  '*:first-of-type': {
    flex: '40% 0 0',
  },
  '& > *': {
    flex: '30% 0 0',
  },
});
const listElementStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(32),
  marginBottom: rem(8),
});
const listElementMainStyles = css({
  [nonMobileQuery]: {
    flex: '40% 0 0',
  },
});
const listElementSecondaryStyles = css({
  color: colors.greyscale1000.rgb,
  [nonMobileQuery]: {
    flex: '30% 0 0',
  },
});
const headingListStyles = css({
  margin: '0',
  flex: '30% 0 0',
  [nonMobileQuery]: {
    display: 'none',
  },
});
const buttonWrapperStyles = css({
  paddingTop: rem(8),
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `transparent`,
});

type TableDisplayRow = {
  id: string;
  values: (string | EmotionJSX.Element | undefined)[];
};
type TableDisplayProps = {
  paragraph: string;
  headings: string[];
  rows: TableDisplayRow[];
};
const TableDisplay: React.FC<TableDisplayProps> = ({
  paragraph,
  headings,
  rows,
}) => {
  const minimumToDisplay = 3;
  const [expanded, setExpanded] = useState(false);

  const getListStyles = () =>
    rows.length < minimumToDisplay + 1 || expanded
      ? rowStyles
      : [rowStyles, hideStyles];

  return (
    <>
      <div css={[contentStyles]}>
        <Paragraph hasMargin={false} accent="lead">
          {paragraph}
        </Paragraph>
      </div>
      <div css={headingTopStyles}>
        {headings.map((heading) => (
          <Headline4>{heading}</Headline4>
        ))}
      </div>
      {rows.map(({ id, values }) => (
        <div key={`table-display-${id}`} css={getListStyles()}>
          {values.map((value, idx) => (
            <div
              css={[
                listElementStyles,
                idx === 0 ? listElementMainStyles : listElementSecondaryStyles,
              ]}
            >
              {value && (
                <>
                  <h4 css={headingListStyles}>{headings[idx]}:</h4>
                  {value}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      {rows.length > minimumToDisplay && (
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
export default TableDisplay;
