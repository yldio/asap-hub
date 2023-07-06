import { gp2 } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import DashboardPageBody from '../DashboardPageBody';

const mockStats = {
  sampleCount: 0,
  cohortCount: 0,
  articleCount: 0,
};
describe('DashboardPageBody', () => {
  it('should render latest stats', () => {
    render(
      <DashboardPageBody
        news={{ total: 0, items: [] }}
        latestStats={mockStats}
        upcomingEvents={[]}
        totalOfUpcomingEvents={0}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Latest Stats' })).toBeVisible();
  });

  it('should render News and Updates if there is a news item', () => {
    render(
      <DashboardPageBody
        news={gp2.createNewsResponse()}
        latestStats={mockStats}
        upcomingEvents={[]}
        totalOfUpcomingEvents={0}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'News and Updates' }),
    ).toBeVisible();
  });
  describe('Announcements', () => {
    it('should render announcements if there is an announcement', () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          announcements={[
            {
              id: '123',
              description: 'This is an announcement',
            },
          ]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Announcements' }),
      ).toBeVisible();
      expect(screen.getByText('This is an announcement')).toBeVisible();
    });
  });

  describe('Tools and tutorials', () => {
    it('should render tools and tutorials if there is a guide', () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          guides={[
            {
              id: '123',
              title: 'Learn Header',
              description: [
                {
                  id: '2',
                  title: 'Description title',
                  bodyText: 'Learn how to use gp2.',
                },
              ],
            },
          ]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Tools and Tutorials' }),
      ).toBeVisible();
      expect(screen.getByText('Learn Header')).toBeVisible();
    });
  });

  describe('Upcoming Events', () => {
    it('should render no events if there is no upcoming event items', () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Upcoming Events' }),
      ).toBeVisible();
      expect(screen.getByText('There are no upcoming events.')).toBeVisible();
    });

    it('should render with events if there is an upcoming event item', async () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={gp2
            .createListEventResponse(1)
            .items.map(({ speakers, ...event }) => ({
              ...event,
              hasSpeakersToBeAnnounced: speakers.length === 0,
              eventOwner: <div>GP2 Team</div>,
            }))}
          totalOfUpcomingEvents={1}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Upcoming Events' }),
      ).toBeVisible();
      expect(
        await screen.queryByText('There are no upcoming events.'),
      ).not.toBeInTheDocument();
    });

    it('should render View All if there are more than 3 upcoming event items', () => {
      const history = createMemoryHistory();
      const pushSpy = jest.spyOn(history, 'push');
      render(
        <Router history={history}>
          <DashboardPageBody
            news={{ total: 0, items: [] }}
            latestStats={mockStats}
            upcomingEvents={gp2
              .createListEventResponse(4)
              .items.map(({ speakers, ...event }) => ({
                ...event,
                hasSpeakersToBeAnnounced: speakers.length === 0,
                eventOwner: <div>GP2 Team</div>,
              }))}
            totalOfUpcomingEvents={4}
          />
        </Router>,
      );
      expect(
        screen.getByRole('heading', { name: 'Upcoming Events' }),
      ).toBeVisible();
      const viewAllButton = screen.getByRole('button', { name: 'View All' });
      expect(viewAllButton).toBeVisible();

      fireEvent.click(viewAllButton);

      expect(pushSpy).toHaveBeenCalledWith({ pathname: '/events/upcoming' });
    });
  });
});
