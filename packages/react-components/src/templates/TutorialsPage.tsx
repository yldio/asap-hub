import { ComponentProps } from 'react';

import TutorialsPageHeader from './TutorialsPageHeader';

type TutorialsPageProps = ComponentProps<typeof TutorialsPageHeader>;

const TutorialsPage: React.FC<TutorialsPageProps> = ({
  children,
  ...props
}) => (
  <article>
    <TutorialsPageHeader {...props} />
    <main>{children}</main>
  </article>
);

export default TutorialsPage;
