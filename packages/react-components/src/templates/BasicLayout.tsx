import React from 'react';
import css from '@emotion/css';

import { Header } from '../molecules';
import { steel } from '../colors';

const styles = css({
  height: '100%',

  display: 'grid',
  gridTemplateRows: 'max-content auto',
  justifyItems: 'start',
});
const contentStyles = css({
  justifySelf: 'stretch',

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
