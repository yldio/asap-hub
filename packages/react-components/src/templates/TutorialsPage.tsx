import { ComponentProps } from 'react';

import { HelpSection } from '../organisms';
import TutorialsPageHeader from './TutorialsPageHeader';

type TutorialsPageProps = ComponentProps<typeof TutorialsPageHeader>;

const TutorialsPage: React.FC<TutorialsPageProps> = ({
  children,
  ...props
}) => (
  <>
    <TutorialsPageHeader {...props} />
    <main>{children}</main>
    <HelpSection />
  </>
);

export default TutorialsPage;
