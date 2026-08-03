import { createEventResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import EventNumberOfSpeakers from '../EventNumberOfSpeakers';

const mockIsEnabled = jest.fn().mockReturnValue(false);
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

beforeEach(() => {
  mockIsEnabled.mockReturnValue(false);
});

it('shows number of speakers with singular form', () => {
  render(
    <EventNumberOfSpeakers
      {...createEventResponse({
        numberOfSpeakers: 1,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 5,
      })}
    />,
  );
  expect(screen.getByText('1 Speaker')).toBeInTheDocument();
  expect(screen.queryByText('1 Speakers')).not.toBeInTheDocument();
});

it('shows number of speakers with plural form', () => {
  render(
    <EventNumberOfSpeakers
      {...createEventResponse({
        numberOfSpeakers: 3,
        numberOfExternalSpeakers: 4,
        numberOfUnknownSpeakers: 5,
      })}
    />,
  );
  expect(screen.getByText('7 Speakers')).toBeInTheDocument();
});
it('do not shows number of speakers when there are no speakers', () => {
  render(
    <EventNumberOfSpeakers
      {...createEventResponse({
        numberOfSpeakers: 0,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 5,
      })}
    />,
  );
  expect(screen.queryByText(/Speaker/i)).not.toBeInTheDocument();
});

describe('speakers that have a user without a team', () => {
  const speakers = [
    { user: { id: 'user-1', displayName: 'John Doe' } },
    {
      team: { id: 'team-1', displayName: 'Team' },
      user: { id: 'user-2', displayName: 'Jane Doe' },
      role: 'Genetics',
    },
  ];

  it('counts them when the flag is enabled', () => {
    mockIsEnabled.mockReturnValue(true);
    render(<EventNumberOfSpeakers speakers={speakers} />);
    expect(screen.getByText('2 Speakers')).toBeInTheDocument();
  });

  it('ignores them when the flag is disabled', () => {
    render(<EventNumberOfSpeakers speakers={speakers} />);
    expect(screen.getByText('1 Speaker')).toBeInTheDocument();
  });
});
