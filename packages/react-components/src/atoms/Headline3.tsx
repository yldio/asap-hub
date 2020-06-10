import React from 'react';
import css from '@emotion/css';

import { largeDesktopScreen, mobileScreen, vminLinearCalc } from '../pixels';
import { TextChildren, commonStyles } from '../text';

const styles = css({
  fontWeight: 'bold',
  fontSize: vminLinearCalc(
    mobileScreen,
    24.48,
    largeDesktopScreen,
    26.56,
    'px',
  ),
  lineHeight: vminLinearCalc(mobileScreen, 30, largeDesktopScreen, 36, 'px'),
});

interface Headline3Props {
  children: TextChildren;
}
const Headline3: React.FC<Headline3Props> = ({ children }) => (
  <h3 css={[commonStyles, styles]}>{children}</h3>
);

export default Headline3;
