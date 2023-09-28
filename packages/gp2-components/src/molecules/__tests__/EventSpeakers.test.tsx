import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import EventSpeakers from '../EventSpeakers';

describe('EventSpeakers', () => {
  const renderEventSpeakers = (speakers: gp2Model.EventSpeaker[]) =>
    render(<EventSpeakers speakers={speakers} />);

  it('should render all types of speakers', () => {
    const numberOfInternalSpeakers = 1;
    const numberOfExternalSpeakers = 1;
    const numberOfSpeakersToBeAnnounced = 1;

    renderEventSpeakers(
      gp2Fixtures.getSpeakers(
        numberOfInternalSpeakers,
        numberOfExternalSpeakers,
        numberOfSpeakersToBeAnnounced,
      ),
    );

    expect(screen.getByRole('link').getAttribute('href')).toBe(
      '/users/user-id-0',
    );
    expect(screen.getByRole('img').textContent).toBe('JD');
    expect(screen.getByText('John Doe 0')).toBeVisible();
    expect(screen.getAllByText('Some Topic').length).toBe(2);
    expect(screen.getByText('John')).toBeVisible();
    expect(screen.getByText('To be announced')).toBeVisible();
  });
});
