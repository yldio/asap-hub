import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import {
  createListEventResponse,
  createListResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import DashboardPageBody from '../DashboardPageBody';

const props: ComponentProps<typeof DashboardPageBody> = {
  news: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      created: '2020-09-07T17:36:54Z',
      title: 'News Title',
      type: 'News',
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb77',
      created: '2020-09-07T17:36:54Z',
      title: 'Tutorial Title',
      type: 'Tutorial',
    },
  ],
  pastEvents: [],
  userId: '42',
  teamId: '1337',
  roles: [],
  reminders: [],
  dismissedGettingStarted: false,
  upcomingEvents: undefined,
  recentSharedOutputs: createListResearchOutputResponse(5),
};
it('renders first news card', () => {
  render(
    <DashboardPageBody
      {...props}
      news={[
        {
          id: '55724942-3408-4ad6-9a73-14b92226ffb6',
          created: '2020-09-07T17:36:54Z',
          title: 'News Title 1',
          type: 'News',
        },
      ]}
    />,
  );
  expect(
    screen
      .queryAllByText(/title/i, { selector: 'h4' })
      .map(({ textContent }) => textContent),
  ).toEqual(['News Title 1']);
});

it('renders news section when there are no news', () => {
  render(<DashboardPageBody {...props} news={[]} />);

  expect(screen.queryByText('Latest news from ASAP')).not.toBeInTheDocument();
});

it('renders news section', () => {
  render(<DashboardPageBody {...props} />);

  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(expect.arrayContaining(['News Title']));
  expect(screen.getByTestId('view-news').querySelector('a')).toHaveTextContent(
    'View All',
  );
  expect(screen.getByTestId('view-news').querySelector('a')).toHaveAttribute(
    'href',
    '/news',
  );
});

it('hides add links to your work space section when user is not a member of a team', () => {
  const { rerender } = render(<DashboardPageBody {...props} teamId="12345" />);
  expect(screen.queryByText(/Add important links/i)).toBeVisible();
  rerender(<DashboardPageBody {...props} teamId={undefined} />);
  expect(screen.queryByText(/Add important links/i)).toBeNull();
});

it('displays events cards or placeholder if there are no events', () => {
  const { rerender } = render(
    <DashboardPageBody
      {...props}
      upcomingEvents={createListEventResponse(4, { customTitle: 'TestEvent' })}
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
              ...createResearchOutputResponse(),
              title: 'Shared 1',
              documentType: 'Article',
            },
            {
              ...createResearchOutputResponse(),
              title: 'Shared 2',
              documentType: 'Article',
            },
            {
              ...createResearchOutputResponse(),
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
