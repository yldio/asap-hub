import { ComponentProps } from 'react';

import AboutPageHeader from './AboutPageHeader';
import PageConstraints from './PageConstraints';

type AboutPageProps = ComponentProps<typeof AboutPageHeader>;

const About: React.FC<AboutPageProps> = ({ children }) => (
  <article>
    <AboutPageHeader />
    <PageConstraints>{children}</PageConstraints>
  </article>
);

export default About;
