import { gp2 } from '@asap-hub/fixtures';
import { DashboardPageBody } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Dashboard / Dashboard Page Body',
  component: DashboardPageBody,
};

const mockedDashboardStats = {
  articleCount: 31,
  cohortCount: 12,
  sampleCount: 32131,
};

export const Normal = () => (
  <DashboardPageBody
    news={gp2.createNewsResponse()}
    latestStats={mockedDashboardStats}
    upcomingEvents={gp2
      .createListEventResponse(3)
      .items.map(({ speakers, ...event }) => ({
        ...event,
        hasSpeakersToBeAnnounced: !speakers.length,
        eventOwner: <div>GP2 Team</div>,
      }))}
    totalOfUpcomingEvents={4}
  />
);
