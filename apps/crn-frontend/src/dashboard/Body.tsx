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
          <LazySection title="Upcoming Events">
            <UpcomingEventsSection date={date} />
          </LazySection>
          <LazySection title="Past Events">
            <PastEventsSection date={date} user={user} />
          </LazySection>
          <LazySection title="Recent Shared Research">
            <RecentSharedResearchSection />
          </LazySection>
          <LazySection title="Latest Users">
            <LatestUsersSection />
          </LazySection>
        </>
      }
    />
  );
};

export default Body;
