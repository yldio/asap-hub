import { createEventResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import EventNumberOfSpeakers from '../EventNumberOfSpeakers';

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
