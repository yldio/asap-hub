import { ComponentProps } from 'react';
import { render, screen, within } from '@testing-library/react';

import SubscribeToCalendarsPage from '../SubscribeToCalendarsPage';

const props: ComponentProps<typeof SubscribeToCalendarsPage> = {
  hubCalendars: [
    { id: 'hub@asap.science', name: 'ASAP Hub', color: '#B1365F' },
  ],
  interestGroupCalendars: [
    { id: 'ig@asap.science', name: 'IG Calendar', color: '#5C1158' },
  ],
  workingGroupCalendars: [
    { id: 'wg@asap.science', name: 'WG Calendar', color: '#711616' },
  ],
  seminarSeriesCalendars: [
    { id: 'seminar@asap.science', name: 'Seminar Calendar', color: '#691426' },
  ],
};

const getSection = (title: string) =>
  screen.getByRole('heading', { name: title }).parentElement!.parentElement!;

it('renders the CRN Hub Updates section', () => {
  render(<SubscribeToCalendarsPage {...props} />);
  expect(
    screen.getByRole('heading', { name: 'CRN Hub Updates' }),
  ).toBeVisible();
});

it.each`
  title                | calendarName
  ${'Interest Groups'} | ${'IG Calendar'}
  ${'Working Groups'}  | ${'WG Calendar'}
  ${'Seminar Series'}  | ${'Seminar Calendar'}
`('renders $calendarName in the $title section', ({ title, calendarName }) => {
  render(<SubscribeToCalendarsPage {...props} />);
  expect(within(getSection(title)).getByText(calendarName)).toBeVisible();
});

it('renders the group icons in the interest group and working group sections', () => {
  render(<SubscribeToCalendarsPage {...props} />);
  expect(
    within(getSection('Interest Groups')).getByTitle('Interest Group'),
  ).toBeInTheDocument();
  expect(
    within(getSection('Working Groups')).getByTitle('Working Groups'),
  ).toBeInTheDocument();
});

it('renders the manual setup instructions and the tech support call to action', () => {
  render(<SubscribeToCalendarsPage {...props} />);
  expect(screen.getByRole('link', { name: 'Apple Calendar' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Outlook' })).toBeVisible();
  expect(screen.getByText('Having trouble accessing an event?')).toBeVisible();
  expect(
    screen.getByRole('link', { name: 'Contact Tech Support' }),
  ).toHaveAttribute(
    'href',
    expect.stringMatching(/^mailto:techsupport@asap\.science/),
  );
});
