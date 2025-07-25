import { ComponentProps, PropsWithChildren } from 'react';

import TutorialsPageHeader from './TutorialsPageHeader';

type TutorialsPageProps = ComponentProps<typeof TutorialsPageHeader>;

const TutorialsPage: React.FC<PropsWithChildren<TutorialsPageProps>> = ({
  children,
  ...props
}) => (
  <article>
    <TutorialsPageHeader {...props} />
    <main>{children}</main>
  </article>
);

export default TutorialsPage;
