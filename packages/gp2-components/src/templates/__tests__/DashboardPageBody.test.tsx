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
  it('should render GP2 Hub Stats', () => {
    render(
      <DashboardPageBody
        news={{ total: 0, items: [] }}
        latestStats={mockStats}
        upcomingEvents={[]}
        totalOfUpcomingEvents={0}
        latestUsers={[]}
        pastEvents={[]}
        totalOfPastEvents={0}
        recentOutputs={[]}
        totalOutputs={0}
        announcements={[]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'GP2 Hub Stats' }),
    ).toBeVisible();
  });

  it('should render Latest News if there is a news item', () => {
    render(
      <DashboardPageBody
        news={gp2.createNewsResponse()}
        latestStats={mockStats}
        upcomingEvents={[]}
        totalOfUpcomingEvents={0}
        latestUsers={[]}
        pastEvents={[]}
        totalOfPastEvents={0}
        recentOutputs={[]}
        totalOutputs={0}
        announcements={[]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Latest News' })).toBeVisible();
  });
  describe('Announcements', () => {
    it('hides the card if there are no announcements', () => {
      render(
        <DashboardPageBody
          news={gp2.createNewsResponse()}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          latestUsers={[]}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
        />,
      );
      expect(screen.queryByText('Announcements')).not.toBeInTheDocument();
    });

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
          latestUsers={[]}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Announcements' }),
      ).toBeVisible();
      expect(screen.getByText('This is an announcement')).toBeVisible();
    });
  });

  describe('Tools and tutorials', () => {
    it('should not render tools and tutorials if there is no guide', () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          latestUsers={[]}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
        />,
      );
      expect(
        screen.queryByRole('heading', { name: 'Tools and Tutorials' }),
      ).not.toBeInTheDocument();
    });

    it('should render tools and tutorials if there is a guide', () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          latestUsers={[]}
          recentOutputs={[]}
          totalOutputs={0}
          guides={[
            {
              id: '123',
              title: 'Learn Header',
              icon: '://icon.url',
              description: [
                {
                  id: '2',
                  title: 'Description title',
                  bodyText: 'Learn how to use gp2.',
                },
              ],
            },
          ]}
          pastEvents={[]}
          totalOfPastEvents={0}
          announcements={[]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Tools and Tutorials' }),
      ).toBeVisible();
      expect(screen.getByText('Learn Header')).toBeVisible();
      expect(screen.getByRole('img', { name: 'Learn Header' })).toBeVisible();
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
          latestUsers={[]}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
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
              tags: event.tags.map((k) => k.name),
            }))}
          totalOfUpcomingEvents={1}
          latestUsers={[]}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
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
                tags: event.tags.map((k) => k.name),
              }))}
            totalOfUpcomingEvents={4}
            latestUsers={[]}
            pastEvents={[]}
            totalOfPastEvents={0}
            recentOutputs={[]}
            totalOutputs={0}
            announcements={[]}
          />
        </Router>,
      );
      expect(
        screen.getByRole('heading', { name: 'Upcoming Events' }),
      ).toBeVisible();
      const viewAllButton = screen.getByTestId('view-upcoming-events');
      expect(viewAllButton).toBeVisible();

      fireEvent.click(viewAllButton);

      expect(pushSpy).toHaveBeenCalledWith({ pathname: '/events/upcoming' });
    });
  });

  describe('Latest Users', () => {
    it('should render users if there is a latest user item', async () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          latestUsers={[
            {
              ...gp2.createUserResponse(),
              displayName: 'John Doe',
            },
            {
              ...gp2.createUserResponse(),
              displayName: 'Octavian Ratiu',
            },
            {
              ...gp2.createUserResponse(),
              displayName: 'User 3',
            },
          ]}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Latest Users' }),
      ).toBeVisible();
      expect(screen.getByText(/John Doe/i)).toBeVisible();
      expect(screen.getByText(/Octavian Ratiu/i)).toBeVisible();
      expect(screen.getByText(/User 3/i)).toBeVisible();
    });

    it('should render View All', () => {
      const history = createMemoryHistory();
      const pushSpy = jest.spyOn(history, 'push');
      render(
        <Router history={history}>
          <DashboardPageBody
            news={{ total: 0, items: [] }}
            latestStats={mockStats}
            latestUsers={gp2.createUsersResponse(3).items}
            upcomingEvents={[]}
            totalOfUpcomingEvents={0}
            pastEvents={[]}
            totalOfPastEvents={0}
            recentOutputs={[]}
            totalOutputs={0}
            announcements={[]}
          />
        </Router>,
      );
      expect(
        screen.getByRole('heading', { name: 'Latest Users' }),
      ).toBeVisible();
      const viewAllButton = screen.getByTestId('view-users');
      expect(viewAllButton).toBeVisible();

      fireEvent.click(viewAllButton);

      expect(pushSpy).toHaveBeenCalledWith({ pathname: '/users' });
    });
  });

  describe('Past Events', () => {
    it('should render past events', async () => {
      const pastEvents = gp2.createListEventResponse(3, {
        customTitle: 'TestEvent',
      }).items;
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          latestUsers={[]}
          pastEvents={pastEvents}
          totalOfPastEvents={1}
          recentOutputs={[]}
          totalOutputs={0}
          announcements={[]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Past Events' }),
      ).toBeVisible();
      expect(screen.getByText('TestEvent 1')).toBeVisible();
      expect(
        await screen.queryByTestId('view-past-events'),
      ).not.toBeInTheDocument();
    });

    it('should render View All if there are more than 3 past event items', () => {
      const history = createMemoryHistory();
      const pushSpy = jest.spyOn(history, 'push');
      render(
        <Router history={history}>
          <DashboardPageBody
            news={{ total: 0, items: [] }}
            latestStats={mockStats}
            upcomingEvents={[]}
            totalOfUpcomingEvents={0}
            latestUsers={[]}
            pastEvents={gp2.createListEventResponse(4).items}
            totalOfPastEvents={4}
            recentOutputs={[]}
            totalOutputs={0}
            announcements={[]}
          />
        </Router>,
      );

      expect(
        screen.getByRole('heading', { name: 'Past Events' }),
      ).toBeVisible();
      const viewAllButton = screen.getByTestId('view-past-events');
      expect(viewAllButton).toBeVisible();

      fireEvent.click(viewAllButton);

      expect(pushSpy).toHaveBeenCalledWith({ pathname: '/events/past' });
    });
  });

  describe('Recent Outputs', () => {
    it('should render outputs if there is any', async () => {
      render(
        <DashboardPageBody
          news={{ total: 0, items: [] }}
          latestStats={mockStats}
          latestUsers={[]}
          upcomingEvents={[]}
          totalOfUpcomingEvents={0}
          pastEvents={[]}
          totalOfPastEvents={0}
          recentOutputs={[
            {
              ...gp2.createOutputResponse(),
              id: 'output-1',
              title: 'Output 1',
              documentType: 'GP2 Reports',
              addedDate: '2023-10-11T09:00:00Z',
            },
            {
              ...gp2.createOutputResponse(),
              id: 'output-2',
              title: 'Output 2',
              documentType: 'Training Materials',
              addedDate: '2023-10-09T09:00:00Z',
            },
          ]}
          totalOutputs={2}
          announcements={[]}
        />,
      );
      expect(
        screen.getByRole('heading', { name: 'Recent Outputs' }),
      ).toBeVisible();
      expect(screen.getByText('Output 1')).toBeVisible();
      expect(screen.getAllByText('GP2 Reports').length).toBeGreaterThan(0);
      expect(screen.getByText('WED, 11 OCT 2023')).toBeVisible();

      expect(screen.getByText('Output 2')).toBeVisible();
      expect(screen.getAllByText('Training Materials').length).toBeGreaterThan(
        0,
      );
      expect(screen.getByText('MON, 9 OCT 2023')).toBeVisible();
    });

    it('should render View All', () => {
      const history = createMemoryHistory();
      const pushSpy = jest.spyOn(history, 'push');
      render(
        <Router history={history}>
          <DashboardPageBody
            news={{ total: 0, items: [] }}
            latestStats={mockStats}
            latestUsers={[]}
            upcomingEvents={[]}
            totalOfUpcomingEvents={0}
            pastEvents={[]}
            totalOfPastEvents={0}
            recentOutputs={gp2.createListOutputResponse(9).items}
            totalOutputs={9}
            announcements={[]}
          />
        </Router>,
      );
      expect(
        screen.getByRole('heading', { name: 'Recent Outputs' }),
      ).toBeVisible();
      const viewAllButton = screen.getByTestId('view-outputs');
      expect(viewAllButton).toBeVisible();

      fireEvent.click(viewAllButton);

      expect(pushSpy).toHaveBeenCalledWith({ pathname: '/outputs' });
    });
  });
});
