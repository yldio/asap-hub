import { ReactText } from 'react';
import { css } from '@emotion/react';

import { lead, steel, paper } from '../colors';
import { rem } from '../pixels';

const containerStyles = css({
  height: rem(24),
  display: 'grid',
  alignItems: 'center',
});
const hrStyles = css({
  gridRow: 1,
  gridColumn: 1,
  justifySelf: 'stretch',
  margin: 0,

  border: 'none',
  borderTop: `1px solid ${steel.rgb}`,
});
const textStyles = css({
  ':empty': {
    display: 'none',
  },
  gridRow: 1,
  gridColumn: 1,

  boxSizing: 'border-box',
  paddingLeft: '.5em',
  paddingRight: '.5em',
  minWidth: rem(36),
  justifySelf: 'center',
  textAlign: 'center',

  backgroundColor: paper.rgb,
  color: lead.rgb,
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: rem(13.6),
  lineHeight: `${18 / 13.6}em`,
});

interface DividerProps {
  readonly children?: ReactText | ReadonlyArray<ReactText>;
}
const Divider: React.FC<DividerProps> = ({ children }) => (
  <div css={containerStyles}>
    <hr css={hrStyles} />
    <span css={textStyles}>{children}</span>
  </div>
);

export default Divider;
