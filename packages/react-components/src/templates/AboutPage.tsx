import { ComponentProps } from 'react';

import AboutPageHeader from './AboutPageHeader';
import PageContraints from './PageConstraints';

type AboutPageProps = ComponentProps<typeof AboutPageHeader>;

const About: React.FC<AboutPageProps> = ({ children }) => (
  <article>
    <AboutPageHeader />
    <PageContraints>{children}</PageContraints>
  </article>
);

export default About;
