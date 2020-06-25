import React from 'react';
import css from '@emotion/css';

import { largeDesktopScreen, mobileScreen, vminLinearCalc } from '../pixels';
import { TextChildren, layoutStyles } from '../text';

const styles = css({
  fontWeight: 'bold',
  fontSize: vminLinearCalc(mobileScreen, 35.25, largeDesktopScreen, 41.5, 'px'),
  lineHeight: vminLinearCalc(mobileScreen, 42, largeDesktopScreen, 48, 'px'),
});

interface DisplayProps {
  readonly children: TextChildren;
}
const Display: React.FC<DisplayProps> = ({ children }) => (
  <h1 css={[layoutStyles, styles]}>{children}</h1>
);

export default Display;
