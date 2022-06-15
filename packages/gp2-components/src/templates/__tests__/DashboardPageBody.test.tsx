import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createPageResponse } from '@asap-hub/fixtures';

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
      title: 'Event Title',
      type: 'Event',
    },
  ],
  pages: [createPageResponse('1'), createPageResponse('2')],
  userId: '42',
  teamId: '1337',
};

it('renders multiple news cards', () => {
  render(<DashboardPageBody {...props} />);
  expect(
    screen
      .queryAllByText(/title/i, { selector: 'h2' })
      .map(({ textContent }) => textContent),
  ).toEqual(['Page 1 title', 'Page 2 title', 'News Title', 'Event Title']);
});

it('renders news section when there are no news', () => {
  render(<DashboardPageBody {...props} news={[]} />);

  expect(screen.queryByText('Latest news from ASAP')).not.toBeInTheDocument();
  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(expect.arrayContaining(['Page 1 title', 'Page 2 title']));
});

it('renders news section when there are no pages', () => {
  render(<DashboardPageBody {...props} pages={[]} />);

  expect(
    screen.queryByText('Not sure where to start?'),
  ).not.toBeInTheDocument();
  expect(
    screen.getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(expect.arrayContaining(['News Title', 'Event Title']));
});
