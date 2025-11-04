import { ComponentProps, PropsWithChildren } from 'react';
import { css } from '@emotion/react';

import AboutPageHeader from './AboutPageHeader';
import { defaultPageLayoutPaddingStyle } from '../layout';

const mainStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

type AboutPageProps = ComponentProps<typeof AboutPageHeader> &
  PropsWithChildren<{}>;

const About: React.FC<AboutPageProps> = ({ children }) => (
  <article>
    <AboutPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default About;
