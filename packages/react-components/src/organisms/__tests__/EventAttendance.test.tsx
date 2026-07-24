import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';

import { fern, warning500 } from '../../colors';
import EventAttendance, { EventAttendanceTeam } from '../EventAttendance';

const progressArcStroke = (wheel: Element | undefined) =>
  wheel?.querySelectorAll('circle')[1]?.getAttribute('stroke');

const teams: EventAttendanceTeam[] = [
  {
    teamId: 't1',
    teamName: 'Team Alpha',
    attended: true,
    teamType: 'Discovery Team',
  },
  {
    teamId: 't2',
    teamName: 'Team Beta',
    attended: false,
    isTeamInactive: true,
    teamType: 'Resource Team',
  },
  { teamId: 't3', teamName: 'Team Gamma', attended: true },
];

const props = {
  teamsAttended: 18,
  teamsTotal: 25,
  sinceLastEvent: {
    count: 10,
    teamsAttended: 15,
    teamsTotal: 25,
  },
  teams,
};

const renderCard = (
  overrides: Partial<typeof props> & Record<string, unknown> = {},
) =>
  render(
    <StaticRouter location="/">
      <EventAttendance {...props} {...overrides} />
    </StaticRouter>,
  );

describe('EventAttendance', () => {
  it('renders the title and both metric cards', () => {
    const { getAllByText, getByText } = renderCard();
    // title + progress metric label both read "Attendance"
    expect(getAllByText('Attendance').length).toBeGreaterThanOrEqual(1);
    expect(getByText('72%')).toBeVisible();
    expect(getByText('18 of 25 teams')).toBeVisible();
    expect(getByText('Since last event')).toBeVisible();
    expect(getByText('+ 10')).toBeVisible();
    expect(getByText('from 15 of 25 teams')).toBeVisible();
  });

  it('derives the attendance percentage from the team counts', () => {
    const { getByText } = renderCard({ teamsAttended: 3, teamsTotal: 4 });
    expect(getByText('75%')).toBeVisible();
  });

  it('renders the empty state with an add action when there are no teams', async () => {
    const onAddAttendance = jest.fn();
    const { getByText, getByRole, queryByRole } = renderCard({
      teamsAttended: 0,
      teamsTotal: 0,
      teams: [],
      onAddAttendance,
    });
    expect(
      getByText('Add the teams that took part, then mark who attended.'),
    ).toBeVisible();
    expect(queryByRole('table')).not.toBeInTheDocument();

    await userEvent.click(getByRole('button', { name: /add attendance/i }));
    expect(onAddAttendance).toHaveBeenCalledTimes(1);
  });

  it('renders the read-only empty state without an add action for non-editors', () => {
    const { getByText, queryByText, queryByRole } = renderCard({
      teamsAttended: 0,
      teamsTotal: 0,
      teams: [],
    });
    expect(getByText('No attendance recorded yet')).toBeVisible();
    expect(
      queryByText('Add the teams that took part, then mark who attended.'),
    ).not.toBeInTheDocument();
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('colours the progress amber below 60% and green otherwise', () => {
    const { getAllByRole, rerender } = renderCard({
      teamsAttended: 1,
      teamsTotal: 4,
    });
    expect(
      progressArcStroke(getAllByRole('progressbar', { hidden: true })[0]),
    ).toBe(warning500.rgb);

    rerender(
      <StaticRouter location="/">
        <EventAttendance {...props} teamsAttended={3} teamsTotal={4} />
      </StaticRouter>,
    );
    expect(
      progressArcStroke(getAllByRole('progressbar', { hidden: true })[0]),
    ).toBe(fern.rgb);
  });

  it('renders the team-type icon for each team', () => {
    const { getByTitle } = renderCard();
    expect(getByTitle('Discovery Team Icon')).toBeInTheDocument();
    expect(getByTitle('Resource Team Icon')).toBeInTheDocument();
    expect(getByTitle('Team')).toBeInTheDocument();
  });

  it('links each team and shows attended / did-not-attend status', () => {
    const { getByText, getAllByLabelText, getByLabelText } = renderCard();
    expect(getByText('Team Alpha').closest('a')).toHaveAttribute(
      'href',
      '/network/teams/t1',
    );
    expect(getAllByLabelText('Attended')).toHaveLength(2);
    expect(getByLabelText('Did not attend')).toBeInTheDocument();
  });

  it('shows a decrease arrow when the delta is negative', () => {
    const { getByLabelText, getByText } = renderCard({
      sinceLastEvent: { count: -8, teamsAttended: 12, teamsTotal: 25 },
    });
    expect(getByLabelText('Decrease')).toBeInTheDocument();
    expect(getByText('- 8')).toBeVisible();
  });

  it('omits the Since last event metric when there is nothing to compare', () => {
    const { queryByText, queryByLabelText } = renderCard({
      sinceLastEvent: undefined,
    });
    expect(queryByText('Since last event')).not.toBeInTheDocument();
    expect(queryByLabelText('Increase')).not.toBeInTheDocument();
  });

  it('calls onExport and onEdit when the header buttons are clicked', async () => {
    const onExport = jest.fn();
    const onEdit = jest.fn();
    const { getByLabelText } = renderCard({ onExport, onEdit });

    await userEvent.click(getByLabelText('Download attendance'));
    expect(onExport).toHaveBeenCalledTimes(1);

    await userEvent.click(getByLabelText('Edit attendance'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('does not show the View More Attendees control for 10 or fewer teams', () => {
    const { queryByText } = renderCard();
    expect(queryByText('View More Attendees')).not.toBeInTheDocument();
  });

  it('collapses to 10 teams and reveals the rest on View More Attendees', async () => {
    const manyTeams: EventAttendanceTeam[] = Array.from(
      { length: 12 },
      (_, index) => ({
        teamId: `t${index + 1}`,
        teamName: `Team ${index + 1}`,
        attended: true,
      }),
    );
    const { getByText, queryByText } = renderCard({ teams: manyTeams });

    // only the first 10 are shown initially
    expect(getByText('Team 10')).toBeInTheDocument();
    expect(queryByText('Team 11')).not.toBeInTheDocument();
    expect(queryByText('Team 12')).not.toBeInTheDocument();

    await userEvent.click(getByText('View More Attendees'));

    // all teams are shown and the control disappears
    expect(getByText('Team 11')).toBeInTheDocument();
    expect(getByText('Team 12')).toBeInTheDocument();
    expect(queryByText('View More Attendees')).not.toBeInTheDocument();
  });
});
