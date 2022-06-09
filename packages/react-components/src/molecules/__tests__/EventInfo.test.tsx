import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createEventResponse, createGroupResponse } from '@asap-hub/fixtures';

import EventInfo from '../EventInfo';

jest.mock('../../localization');

const props: ComponentProps<typeof EventInfo> = {
  ...createEventResponse(),
  group: undefined,
};

it('renders an event', () => {
  render(<EventInfo {...props} title="My Event" />);
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    'My Event',
  );
});

it('truncates long event titles', () => {
  render(<EventInfo {...props} title={'blablablha'.repeat(100)} />);

  expect(screen.getByRole('heading', { level: 3 }).textContent).toMatch(/…$/i);
});

it('does not truncate long event titles when limit is null', () => {
  render(
    <EventInfo {...props} titleLimit={null} title={'blablablha'.repeat(100)} />,
  );

  expect(screen.getByRole('heading', { level: 3 }).textContent).not.toMatch(
    /…$/i,
  );
});

it('renders event thumbnail', () => {
  render(
    <EventInfo
      {...props}
      thumbnail={'https://placeholder/40x40'}
      title={'blablablha'}
    />,
  );

  expect(screen.getByAltText(/thumbnail/i).getAttribute('src')).toEqual(
    'https://placeholder/40x40',
  );
});

it('renders placeholder event thumbnail', () => {
  render(
    <EventInfo
      {...props}
      thumbnail={undefined}
      title={'blablablha'.repeat(100)}
    />,
  );

  expect(screen.getByText(/placeholder/i)).toBeInTheDocument();
});

it('renders the group name linking to the group and icon', () => {
  render(
    <EventInfo
      {...props}
      group={{
        ...createGroupResponse(),
        id: 'grp',
        name: 'My Group',
      }}
    />,
  );
  expect(screen.getByText('My Group')).toHaveAttribute(
    'href',
    expect.stringMatching(/grp$/),
  );
  expect(screen.getByTitle('Group')).toBeInTheDocument();
});

it('shows that the event is run by ASAP when there is no group', () => {
  render(<EventInfo {...props} group={undefined} />);
  expect(screen.getByText(/asap event/i)).not.toHaveAttribute('href');
  expect(screen.getByTitle('Calendar')).toBeInTheDocument();
});

it('shows number of speakers with singular form', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 1,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 5,
      })}
      showNumberOfSpeakers={true}
    />,
  );
  expect(screen.getByText('1 Speaker')).toBeInTheDocument();
  expect(screen.queryByText('1 Speakers')).not.toBeInTheDocument();
});

it('do not shows number of speakers when showNumberOfSpeakers is false', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 3,
        numberOfExternalSpeakers: 4,
        numberOfUnknownSpeakers: 5,
      })}
      showNumberOfSpeakers={false}
    />,
  );
  expect(screen.queryByText('7 Speakers')).not.toBeInTheDocument();
});
it('shows number of speakers with plural form', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 3,
        numberOfExternalSpeakers: 4,
        numberOfUnknownSpeakers: 5,
      })}
      showNumberOfSpeakers={true}
    />,
  );
  expect(screen.getByText('7 Speakers')).toBeInTheDocument();
});
it('do not shows number of speakers when there are no speakers', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 0,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 5,
      })}
      showNumberOfSpeakers={true}
    />,
  );
  expect(screen.queryByText(/Speaker/i)).not.toBeInTheDocument();
});

it('displays the teams with number of additional teams', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 10,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 0,
      })}
      showTeams={true}
    />,
  );

  expect(screen.getAllByTestId('associationlist').length).toEqual(7);
  expect(screen.queryByText('+3')).toBeInTheDocument();
});

it('displays the team only once', () => {
  render(
    <EventInfo
      {...createEventResponse()}
      speakers={Array.from({ length: 10 }, () => ({
        team: {
          displayName: 'the team',
          id: 'team-id',
        },
      }))}
      showTeams={true}
    />,
  );

  expect(screen.getAllByTestId('associationlist').length).toEqual(1);
});

it('do not display the team when there is none', () => {
  render(
    <EventInfo
      {...createEventResponse({
        numberOfSpeakers: 0,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 0,
      })}
      showTeams={true}
    />,
  );

  expect(screen.queryByTitle('Team')).not.toBeInTheDocument();
});

it('shows the event time', () => {
  render(
    <EventInfo
      {...props}
      startDate="2021-01-01T08:00:00Z"
      startDateTimeZone="Europe/Tallinn"
    />,
  );
  expect(screen.getByText(/8:00/)).toBeVisible();
});

it('only links to events that are not cancelled', () => {
  const { rerender } = render(<EventInfo {...props} status="Tentative" />);
  expect(
    screen.getByRole('heading', { level: 3 }).closest('a'),
  ).toHaveAttribute('href');

  rerender(<EventInfo {...props} status="Cancelled" />);
  expect(
    screen.getByRole('heading', { level: 3 }).closest('a'),
  ).not.toHaveAttribute('href');
});
