import { css } from '@emotion/react';
import React from 'react';

import { apricot, warning900 } from '../colors';
import { infoCircleYellow } from '../icons';
import { perRem } from '../pixels';

const containerStyles = css({
  height: `${56 / perRem}em`,
  display: 'flex',
  flexFlow: 'row',
  alignItems: 'center',
  gap: `${16 / perRem}em`,
  backgroundColor: apricot.rgb,
  paddingLeft: `${16 / perRem}em`,
});
const paragraphStyles = css({
  color: warning900.rgb,
  fontSize: 17,
});

interface WarningTextProps {
  text?: string;
}
const WarningText: React.FC<WarningTextProps> = ({ text }) => (
  <div css={containerStyles}>
    {infoCircleYellow}
    <p css={paragraphStyles}>{text}</p>
  </div>
);

export default WarningText;
