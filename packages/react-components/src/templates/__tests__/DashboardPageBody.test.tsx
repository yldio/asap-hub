import { ComponentProps } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { GuideDataObject } from '@asap-hub/model';
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
  userId: '42',
  teamId: '1337',
  roles: [],
  reminders: [],
  announcements: [],
  guides: [],
  dismissedGettingStarted: false,
};

it('renders guides', async () => {
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

  await waitFor(() => {
    guideTitle.click();
  });

  const linkButton = await screen.findByText('Test Link');
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
  expect(screen.getByText('View All →', { selector: 'a' })).toBeInTheDocument();
});

describe('the dynamic sections slot', () => {
  it('renders the lazily-loaded sections passed in', () => {
    render(
      <DashboardPageBody
        {...props}
        dynamicSections={<div>lazy dashboard sections</div>}
      />,
    );
    expect(screen.getByText('lazy dashboard sections')).toBeVisible();
  });

  it('renders the static sections around the slot', () => {
    render(
      <DashboardPageBody
        {...props}
        dynamicSections={<div>lazy dashboard sections</div>}
      />,
    );
    // static sections still render even when no dynamic content resolves
    expect(screen.getByText('Reminders')).toBeVisible();
    expect(screen.getByText('Latest News from ASAP')).toBeVisible();
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
    expect(screen.getByText('Latest admin announcements.')).toBeVisible();
  });
});
