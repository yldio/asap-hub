import { render, screen } from '@testing-library/react';
import { subHours } from 'date-fns';
import { EventSpeaker } from '@asap-hub/model';
import { createEventResponse } from '@asap-hub/fixtures';
import SpeakersList from '../SpeakersList';

const gridLabels = ['Speakers', 'Team', 'Speaker', 'Role'];
const team = {
  id: 'team-id-1',
  displayName: 'The team one',
};
const user = {
  id: 'user-id-1',
  firstName: 'Adam',
  lastName: 'Brown',
  displayName: 'Adam Brown',
};
const announcedSpeaker: EventSpeaker = {
  team: { ...team },
  user: { ...user },
};
const unnanouncedSpeaker: EventSpeaker = {
  team: { ...team },
};

const externalSpeaker: EventSpeaker = {
  externalUser: {
    name: 'Jhonny External',
    orcid: '',
  },
};

describe('When rendering the speaker list', () => {
  describe('Event is upcoming', () => {
    it('Renders an unnanounced user', async () => {
      const event = {
        ...createEventResponse(),
        speakers: [unnanouncedSpeaker],
      };

      render(<SpeakersList {...event} />);

      expect(screen.getByText('User to be announced')).toBeVisible();
    });

    it('Renders an announced user', async () => {
      const event = {
        ...createEventResponse(),
        speakers: [announcedSpeaker],
      };

      render(<SpeakersList {...event} />);

      expect(
        screen.getAllByRole('link').map(({ textContent }) => textContent),
      ).toEqual(['The team one', 'Adam Brown']);

      expect(
        screen.getAllByRole('link').map((e) => e.getAttribute('href')),
      ).toEqual([
        expect.stringContaining('team-id-1'),
        expect.stringContaining('user-id-1'),
      ]);
    });

    it('Renders an announced user and checks the grid labels and role', async () => {
      const event = {
        ...createEventResponse(),
        speakers: [{ ...announcedSpeaker, role: 'Genetics' }],
      };
      render(<SpeakersList {...event} />);

      expect(
        screen.getAllByRole('heading').map(({ textContent }) => textContent),
      ).toEqual([...gridLabels]);
      expect(screen.getByText('Genetics')).toBeVisible();
    });

    it('Renders external author', async () => {
      const event = {
        ...createEventResponse(),
        speakers: [externalSpeaker],
      };

      render(<SpeakersList {...event} />);

      expect(screen.getByText('External Speaker')).toBeVisible();
      expect(screen.getByText('Jhonny External')).toBeVisible();
      expect(screen.getByText('Guest')).toBeVisible();
    });
  });

  describe('Event is in the past', () => {
    it('Unnanounced user', async () => {
      const eventInThePast = {
        ...createEventResponse(),
        endDate: subHours(new Date(), 10).toISOString(),
        speakers: [unnanouncedSpeaker],
      };

      render(<SpeakersList {...eventInThePast} />);

      expect(screen.getByText('User was not announced')).toBeVisible();
    });
  });
});
