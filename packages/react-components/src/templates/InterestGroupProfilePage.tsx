import { ComponentProps } from 'react';

import InterestGroupProfileHeader from './InterestGroupProfileHeader';
import { Toast } from '../organisms';
import PageConstraints from './PageConstraints';

type InterestGroupProfilePageProps = ComponentProps<
  typeof InterestGroupProfileHeader
>;
const InterestGroupProfilePage: React.FC<InterestGroupProfilePageProps> = ({
  children,
  active,
  ...props
}) => (
  <article>
    {!active && (
      <Toast accent="warning">
        This group is inactive and might not have all content available.
      </Toast>
    )}
    <InterestGroupProfileHeader {...props} active={active} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default InterestGroupProfilePage;
