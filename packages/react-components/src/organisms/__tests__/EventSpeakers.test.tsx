import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';

import EventSpeakers, {
  EventSpeakerTeamRow,
  EventSpeakerExternalRow,
} from '../EventSpeakers';

const makeMembers = (teamIndex: number, count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: `user-${teamIndex}-${index}`,
    firstName: 'John',
    lastName: 'Doe',
    displayName: `John Doe ${teamIndex}-${index}`,
    role: 'Data Manager',
    isAlumni: index === 0,
  }));

const teams: EventSpeakerTeamRow[] = [
  {
    teamId: 'team-0',
    teamName: 'Team Alpha',
    teamType: 'discovery',
    sharedPreliminaryFindings: true,
    isTeamInactive: true,
    members: makeMembers(0, 2),
  },
  {
    teamId: 'team-1',
    teamName: 'Team Beta',
    teamType: 'resource',
    sharedPreliminaryFindings: false,
    members: makeMembers(1, 1),
  },
];

const externalUsers: EventSpeakerExternalRow = {
  sharedPreliminaryFindings: false,
  members: [{ name: 'External user 1' }],
};

const renderCard = (
  props: Partial<React.ComponentProps<typeof EventSpeakers>> = {},
) =>
  render(
    <StaticRouter location="/">
      <EventSpeakers teams={teams} externalUsers={externalUsers} {...props} />
    </StaticRouter>,
  );

describe('EventSpeakers', () => {
  describe('empty state', () => {
    it('Should show the read-only message for a non-editor', () => {
      const { getByText } = renderCard({ teams: [], externalUsers: undefined });
      expect(
        getByText('No speakers have been added for this event yet.'),
      ).toBeVisible();
    });

    it('Should prompt an editor to add speakers for an upcoming event', () => {
      const { getByText, getByRole } = renderCard({
        teams: [],
        externalUsers: undefined,
        hasFinished: false,
        onAddSpeaker: jest.fn(),
      });
      expect(
        getByText(/Marking who shared preliminary findings becomes available/i),
      ).toBeVisible();
      expect(getByRole('button', { name: /add speakers/i })).toBeVisible();
    });

    it('Should prompt an editor to add presenters for a past event', () => {
      const { getByText } = renderCard({
        teams: [],
        externalUsers: undefined,
        hasFinished: true,
        onAddSpeaker: jest.fn(),
      });
      expect(
        getByText(/Add the people who presented at this event/i),
      ).toBeVisible();
    });

    it('Should fire onAddSpeaker from the empty-state button', async () => {
      const onAddSpeaker = jest.fn();
      const { getByRole } = renderCard({
        teams: [],
        externalUsers: undefined,
        onAddSpeaker,
      });
      await userEvent.click(getByRole('button', { name: /add speakers/i }));
      expect(onAddSpeaker).toHaveBeenCalled();
    });
  });

  describe('metrics', () => {
    it('Should derive the speaker and preliminary-findings metrics', () => {
      const { getByText } = renderCard();
      // 2 + 1 team members + 1 external = 4 total, 3 from teams, 1 non-CRN
      expect(getByText('4')).toBeVisible();
      expect(getByText('3 from teams • 1 non-CRN')).toBeVisible();
      // 1 of 2 teams shared findings = 50%
      expect(getByText('50%')).toBeVisible();
      expect(getByText('1 of 2 teams')).toBeVisible();
    });
  });

  describe('team rows', () => {
    it('Should render team links, counts, inactive badge and findings status', () => {
      const { getByRole, getByText, getByLabelText, getAllByLabelText } =
        renderCard();
      expect(getByRole('link', { name: 'Team Alpha' })).toHaveAttribute(
        'href',
        expect.stringContaining('team-0'),
      );
      expect(getByText('(2)')).toBeVisible();
      expect(getByText('Inactive Team')).toBeInTheDocument();
      expect(getByLabelText('Shared preliminary findings')).toBeInTheDocument();
      // Team Beta + External Users both show the cross.
      expect(getAllByLabelText('No preliminary findings')).toHaveLength(2);
    });

    it('Should expand a team to reveal its members with roles', async () => {
      const { getByRole, queryByRole, getAllByText } = renderCard();
      expect(
        queryByRole('link', { name: 'John Doe 0-0' }),
      ).not.toBeInTheDocument();
      await userEvent.click(getByRole('button', { name: 'Expand Team Alpha' }));
      expect(getByRole('link', { name: 'John Doe 0-0' })).toHaveAttribute(
        'href',
        expect.stringContaining('user-0-0'),
      );
      expect(getAllByText('Data Manager')[0]).toBeVisible();
    });

    it('Should collapse an expanded team', async () => {
      const { getByRole, queryByRole } = renderCard();
      await userEvent.click(getByRole('button', { name: 'Expand Team Alpha' }));
      expect(getByRole('link', { name: 'John Doe 0-0' })).toBeInTheDocument();
      await userEvent.click(
        getByRole('button', { name: 'Collapse Team Alpha' }),
      );
      expect(
        queryByRole('link', { name: 'John Doe 0-0' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('teams without speakers', () => {
    it('Should hide teams that have no speakers and exclude them from the findings count', () => {
      const { queryByRole, getByText } = renderCard({
        teams: [
          ...teams,
          {
            teamId: 'team-empty',
            teamName: 'Empty Team',
            sharedPreliminaryFindings: true,
            members: [],
          },
        ],
        externalUsers: undefined,
      });
      expect(
        queryByRole('link', { name: 'Empty Team' }),
      ).not.toBeInTheDocument();
      // Only Team Alpha + Team Beta count; Team Alpha shared → 1 of 2.
      expect(getByText('1 of 2 teams')).toBeVisible();
    });
  });

  describe('external-only event', () => {
    it('Should render with zero-team findings when there are only external users', () => {
      const { getByText } = renderCard({ teams: [] });
      expect(getByText('0%')).toBeVisible();
      expect(getByText('0 of 0 teams')).toBeVisible();
      expect(getByText('External Users')).toBeVisible();
    });
  });

  describe('external users row', () => {
    it('Should render and expand the external users row', async () => {
      const { getByRole, getByText, queryByText } = renderCard();
      expect(getByText('External Users')).toBeVisible();
      expect(queryByText('External user 1')).not.toBeInTheDocument();
      await userEvent.click(
        getByRole('button', { name: 'Expand External Users' }),
      );
      expect(getByText('External user 1')).toBeVisible();
      expect(getByText('Guest')).toBeVisible();
    });
  });

  describe('admin actions', () => {
    it('Should render and fire the edit and export buttons when provided', async () => {
      const onEdit = jest.fn();
      const onExport = jest.fn();
      const { getByRole } = renderCard({ onEdit, onExport });
      await userEvent.click(getByRole('button', { name: 'Edit speakers' }));
      await userEvent.click(getByRole('button', { name: 'Download speakers' }));
      expect(onEdit).toHaveBeenCalled();
      expect(onExport).toHaveBeenCalled();
    });

    it('Should not render admin buttons for a read-only viewer', () => {
      const { queryByRole } = renderCard();
      expect(
        queryByRole('button', { name: 'Edit speakers' }),
      ).not.toBeInTheDocument();
      expect(
        queryByRole('button', { name: 'Download speakers' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('overflow', () => {
    const manyTeams: EventSpeakerTeamRow[] = Array.from(
      { length: 14 },
      (_, index) => ({
        teamId: `team-${index}`,
        teamName: `Team ${index + 1}`,
        sharedPreliminaryFindings: true,
        members: makeMembers(index, 1),
      }),
    );

    it('Should not render the footer with 10 or fewer rows', () => {
      const { queryByRole } = renderCard({
        teams: manyTeams.slice(0, 10),
        externalUsers: undefined,
      });
      expect(
        queryByRole('button', { name: /view more speakers/i }),
      ).not.toBeInTheDocument();
    });

    it('Should reveal the remaining rows on View More', async () => {
      const { getByRole, queryByRole } = renderCard({
        teams: manyTeams,
        externalUsers: undefined,
      });
      expect(
        queryByRole('button', { name: 'Expand Team 14' }),
      ).not.toBeInTheDocument();
      await userEvent.click(
        getByRole('button', { name: /view more speakers/i }),
      );
      expect(
        getByRole('button', { name: 'Expand Team 14' }),
      ).toBeInTheDocument();
      expect(
        queryByRole('button', { name: /view more speakers/i }),
      ).not.toBeInTheDocument();
    });

    it('Should still expand the last visible team above the footer', async () => {
      const { getByRole, getByText } = renderCard({
        teams: manyTeams,
        externalUsers: undefined,
      });
      // Team 10 is the last visible row while the footer is shown.
      await userEvent.click(getByRole('button', { name: 'Expand Team 10' }));
      expect(getByText('John Doe 9-0')).toBeVisible();
    });
  });
});
