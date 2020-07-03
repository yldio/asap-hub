import React from 'react';
import css from '@emotion/css';

import {
  tabletScreen,
  smallDesktopScreen,
  largeDesktopScreen,
} from '../pixels';

const styles = css({
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'stretch',
  flexDirection: 'column',
  width: '100%',
  margin: 'auto',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    maxWidth: '678px',
  },
  [`@media (min-width:  ${smallDesktopScreen.width}px)`]: {
    maxWidth: '738px',
  },
  [`@media (min-width: ${largeDesktopScreen.width}px)`]: {
    maxWidth: '1122px',
  },
});

type ContainerProps = {
  readonly children: React.ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div css={styles}>{children}</div>
);

export default Container;
