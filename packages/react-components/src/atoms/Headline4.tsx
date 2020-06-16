import React from 'react';
import css from '@emotion/css';

import { largeDesktopScreen, mobileScreen, vminLinearCalc } from '../pixels';
import { TextChildren, layoutStyles } from '../text';

const styles = css({
  fontWeight: 'bold',
  fontSize: vminLinearCalc(mobileScreen, 20.4, largeDesktopScreen, 21.25, 'px'),
  lineHeight: vminLinearCalc(mobileScreen, 24, largeDesktopScreen, 30, 'px'),
});

interface Headline4Props {
  children: TextChildren;
}
const Headline4: React.FC<Headline4Props> = ({ children }) => (
  <h4 css={[layoutStyles, styles]}>{children}</h4>
);

export default Headline4;
