import React from 'react';
import css from '@emotion/css';

import { Header } from '../molecules';
import { steel } from '../colors';

const styles = css({
  maxHeight: '100%',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});
const contentStyles = css({
  alignSelf: 'stretch',

  borderTop: `1px solid ${steel.rgb}`,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
});

interface BasicLayoutProps {
  children: React.ReactNode;
}
const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => (
  <article css={styles}>
    <Header />
    <main css={contentStyles}>{children}</main>
  </article>
);

export default BasicLayout;
