import React from 'react';
import css from '@emotion/css';

import { largeDesktopScreen, mobileScreen, vminLinearCalc } from '../pixels';
import { TextChildren, commonStyles } from '../text';

const styles = css({
  fontWeight: 'bold',
  fontSize: vminLinearCalc(mobileScreen, 29.38, largeDesktopScreen, 33.2, 'px'),
  lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 42, 'px'),
});

interface Headline2Props {
  children: TextChildren;
}
const Headline2: React.FC<Headline2Props> = ({ children }) => (
  <h2 css={[commonStyles, styles]}>{children}</h2>
);

export default Headline2;
