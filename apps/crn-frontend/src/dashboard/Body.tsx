import { ComponentProps, FC } from 'react';
import { User } from '@asap-hub/auth';
import { DashboardPageBody } from '@asap-hub/react-components';

import { useGuidesByCollection } from '../guides/state';

import LazySection from './LazySection';
import UpcomingEventsSection from './sections/UpcomingEventsSection';
import PastEventsSection from './sections/PastEventsSection';
import RecentSharedResearchSection from './sections/RecentSharedResearchSection';
import LatestUsersSection from './sections/LatestUsersSection';

type BodyProps = Omit<
  ComponentProps<typeof DashboardPageBody>,
  'guides' | 'dynamicSections'
> & {
  date: Date;
  user: User;
};

const Body: FC<BodyProps> = ({ date, user, ...props }) => {
  const guides = useGuidesByCollection('Home');

  return (
    <DashboardPageBody
      {...props}
      guides={guides ? guides.items : []}
      dynamicSections={
        <>
          <LazySection>
            <UpcomingEventsSection date={date} />
          </LazySection>
          <LazySection>
            <PastEventsSection date={date} user={user} />
          </LazySection>
          <LazySection>
            <RecentSharedResearchSection />
          </LazySection>
          <LazySection>
            <LatestUsersSection />
          </LazySection>
        </>
      }
    />
  );
};

export default Body;
