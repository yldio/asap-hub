import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import AboutPageHeader from './AboutPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type AboutPageProps = ComponentProps<typeof AboutPageHeader>;

const About: React.FC<AboutPageProps> = ({ children }) => (
  <article>
    <AboutPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default About;
