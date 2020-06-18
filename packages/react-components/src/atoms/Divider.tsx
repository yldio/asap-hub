import React, { ReactText } from 'react';
import css from '@emotion/css';

import { lead, steel, paper } from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  height: `${24 / perRem}em`,
  display: 'grid',
  alignItems: 'center',
});
const hrStyles = css({
  gridRow: 1,
  gridColumn: 1,
  justifySelf: 'stretch',
  margin: 0,

  border: 'none',
  borderTop: `2px solid ${steel.rgb}`,
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
  minWidth: `${36 / perRem}em`,
  justifySelf: 'center',
  textAlign: 'center',

  backgroundColor: paper.rgb,
  color: lead.rgb,
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

interface DividerProps {
  children?: ReactText | ReadonlyArray<ReactText>;
}
const Divider: React.FC<DividerProps> = ({ children }) => (
  <div css={containerStyles}>
    <hr css={hrStyles} />
    <span css={textStyles}>{children}</span>
  </div>
);

export default Divider;
