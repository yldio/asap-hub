import { ComponentProps, PropsWithChildren } from 'react';

import AboutPageHeader from './AboutPageHeader';
import PageConstraints from './PageConstraints';

type AboutPageProps = ComponentProps<typeof AboutPageHeader> &
  PropsWithChildren;

const About: React.FC<AboutPageProps> = ({ children }) => (
  <article>
    <AboutPageHeader />
    <PageConstraints>{children}</PageConstraints>
  </article>
);

export default About;
