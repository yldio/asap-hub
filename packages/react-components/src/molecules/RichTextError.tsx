import React from 'react';
import css from '@emotion/css';

import { Card } from '../atoms';
import { crossIcon } from '../icons';
import { perRem, lineHeight } from '../pixels';
import { ember } from '../colors';

const errorStyles = css({
  display: 'flex',
  svg: {
    stroke: ember.rgb,
  },
});
const iconStyles = css({
  display: 'flex',
  alignItems: 'center',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});

const RichTextError: React.FC = ({ children }) => (
  <Card minPadding accent="red">
    <span css={errorStyles}>
      <span css={iconStyles}>{crossIcon}</span>
      {children}
    </span>
  </Card>
);

export default RichTextError;
