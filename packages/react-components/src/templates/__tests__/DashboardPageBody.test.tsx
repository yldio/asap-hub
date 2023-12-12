import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { GuideDataObject } from '@asap-hub/model';
import {
  createListEventResponse,
  createListResearchOutputResponse,
  createListUserResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import DashboardPageBody from '../DashboardPageBody';

const props: ComponentProps<typeof DashboardPageBody> = {
  news: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      created: '2020-09-07T17:36:54Z',
      title: 'News Title',
      tags: [],
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb77',
      created: '2020-09-07T17:36:54Z',
      title: 'Tutorial Title',
      tags: [],
    },
  ],
  pastEvents: [],
  userId: '42',
  teamId: '1337',
  roles: [],
  reminders: [],
  guides: [],
  dismissedGettingStarted: false,
  upcomingEvents: undefined,
  recentSharedOutputs: createListResearchOutputResponse(5),
  recommendedUsers: createListUserResponse(3).items,
};

it('renders guides', () => {
  const guides: GuideDataObject[] = [
    {
      title: 'Guide Title',
      content: [
        {
          title: '',
          text: '',
          linkText: 'Test Link',
          linkUrl: 'https://test.com',
        },
      ],
    },
  ];
  render(<DashboardPageBody {...props} guides={guides} />);

  const guideTitle = screen.getByText('Guide Title');
  expect(guideTitle).toBeInTheDocument();
  guideTitle.click();
  const linkButton = screen.getByText('Test Link');
  expect(linkButton.closest('a')).toHaveAttribute('href', 'https://test.com');
});

it('renders multiple news cards', () => {
  render(
    <DashboardPageBody
      {...props}
      news={[
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb6',
          created: '2020-09-07T17:36:54Z',
          title: 'News Title 1',
          tags: ['Tag 1'],
        },
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb77',
          created: '2020-09-07T17:36:54Z',
          title: 'Tutorial Title 1',
          tags: [],
        },
      ]}
    />,
  );
  expect(
    screen
      .queryAllByText(/title/i, { selector: 'h4' })
      .map(({ textContent }) => textContent),
  ).toEqual(['News Title 1', 'Tutorial Title 1']);
});

it('renders news section when there are no news', () => {
  render(<DashboardPageBody {...props} news={[]} />);

  expect(screen.queryByText('Latest news from ASAP')).not.toBeInTheDocument();
});

it('renders news section', () => {
  render(<DashboardPageBody {...props} />);

  expect(screen.getByText('Latest News from ASAP')).toBeVisible();
  expect(screen.getByText('News Title')).toBeVisible();
  expect(
    screen
      .getAllByText('View All →', { selector: 'a' })
      .map(({ textContent }) => textContent),
    // There are two View all links because the past events one is always shown
  ).toEqual(expect.arrayContaining(['View All →', 'View All →']));
});

it('displays events cards or placeholder if there are no events', () => {
  const { rerender } = render(
    <DashboardPageBody
      {...props}
      upcomingEvents={createListEventResponse(4, {
        customTitle: 'TestEvent',
      }).items.map((event) => ({
        ...event,
        hasSpeakersToBeAnnounced: false,
        eventOwner: <div>ASAP Team</div>,
      }))}
    />,
  );
  expect(screen.getByText('Upcoming Events')).toBeVisible();
  expect(screen.getByText('Here are some upcoming events.')).toBeVisible();
  expect(screen.getByText('TestEvent 1')).toBeVisible();
  expect(screen.getByText('TestEvent 2')).toBeVisible();
  expect(screen.getByText('TestEvent 3')).toBeVisible();
  expect(
    screen.getByTestId('view-upcoming-events').querySelector('a'),
  ).toHaveTextContent('View All');

  rerender(<DashboardPageBody {...props} upcomingEvents={undefined} />);
  expect(screen.getByText('Upcoming Events')).toBeVisible();
  expect(screen.getByText('Here are some upcoming events.')).toBeVisible();

  expect(screen.getByText('There are no upcoming events.')).toBeVisible();
});

describe('the past events card', () => {
  const events = createListEventResponse(3).items;
  it('renders multiple past events', () => {
    render(<DashboardPageBody {...props} pastEvents={events} />);
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toEqual(expect.arrayContaining(['Event 0', 'Event 1', 'Event 2']));
  });

  it('renders the link to view all past events', () => {
    render(<DashboardPageBody {...props} pastEvents={events} />);

    expect(
      screen.getByTestId('view-past-events').querySelector('a'),
    ).toHaveTextContent('View All');
    expect(
      screen.getByTestId('view-past-events').querySelector('a'),
    ).toHaveAttribute('href', '/events/past');
  });
});

describe('the recent shared outputs card', () => {
  it('renders multiple recent outputs', () => {
    const { getByText } = render(
      <DashboardPageBody
        {...props}
        recentSharedOutputs={{
          items: [
            {
              ...createResearchOutputResponse(0),
              title: 'Shared 1',
              documentType: 'Article',
            },
            {
              ...createResearchOutputResponse(1),
              title: 'Shared 2',
              documentType: 'Article',
            },
            {
              ...createResearchOutputResponse(2),
              title: 'Shared 3',
              documentType: 'Article',
            },
          ],
          total: 3,
        }}
      />,
    );

    expect(getByText('Shared 1')).toBeVisible();
    expect(getByText('Shared 2')).toBeVisible();
    expect(getByText('Shared 3')).toBeVisible();
  });

  it('renders the link to view all shared research', () => {
    render(
      <DashboardPageBody
        {...props}
        recentSharedOutputs={createListResearchOutputResponse(6)}
      />,
    );

    expect(
      screen.getByTestId('view-recent-shared-outputs').querySelector('a'),
    ).toHaveTextContent('View All');
    expect(
      screen.getByTestId('view-recent-shared-outputs').querySelector('a'),
    ).toHaveAttribute('href', '/shared-research');
  });
});

describe('the reminders card', () => {
  it.each`
    description                                                | roles                                   | selector
    ${'shows messaging for staff'}                             | ${['ASAP Staff']}                       | ${/no reminders/i}
    ${'shows messaging for PMs'}                               | ${['Project Manager']}                  | ${/no reminders/i}
    ${'shows staff messaging for users with one staff role'}   | ${['Key Personnel', 'Project Manager']} | ${/no reminders/i}
    ${'informs other users to contact their project managers'} | ${['Key Personnel']}                    | ${/anything to share /i}
  `('$description', ({ roles, selector }) => {
    render(<DashboardPageBody {...props} roles={roles} />);
    expect(screen.getByText(selector)).toBeVisible();
  });
});

describe('the announcements card', () => {
  it('hides the card if there are no announcements', () => {
    render(<DashboardPageBody {...props} />);
    expect(screen.queryByText('Announcements')).not.toBeInTheDocument();
  });

  it('displays the card when there are announcements', () => {
    render(
      <DashboardPageBody
        {...props}
        announcements={[
          {
            id: 'announcement-id',
            description: 'announcement description',
          },
        ]}
      />,
    );
    expect(screen.getByText('Announcements')).toBeVisible();
  });
});

describe('the recommended users card', () => {
  it('shows the recommended users card', () => {
    render(<DashboardPageBody {...props} />);
    expect(screen.getByText('Latest Users')).toBeVisible();
    expect(
      screen.getByText(
        'Explore and learn more about the latest users on the hub.',
      ),
    ).toBeVisible();
  });
});
