import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';

import { rem } from '../../pixels';
import EventAttendance, {
  compareAttendanceTeams,
  EventAttendanceTeam,
} from '../EventAttendance';

globalThis.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as unknown as typeof ResizeObserver;

const mockTableOverflow = (scrollWidth: number, clientWidth: number) => {
  Object.defineProperty(Element.prototype, 'scrollWidth', {
    configurable: true,
    get: () => scrollWidth,
  });
  Object.defineProperty(Element.prototype, 'clientWidth', {
    configurable: true,
    get: () => clientWidth,
  });
};

afterEach(() => mockTableOverflow(0, 0));

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

describe('compareAttendanceTeams', () => {
  it('breaks ties on equal names with a stable teamId order', () => {
    const a: EventAttendanceTeam = {
      teamId: 't-a',
      teamName: 'Same Name',
      attended: true,
    };
    const b: EventAttendanceTeam = {
      teamId: 't-b',
      teamName: 'Same Name',
      attended: true,
    };
    expect(compareAttendanceTeams(a, b)).toBeLessThan(0);
    expect(compareAttendanceTeams(b, a)).toBeGreaterThan(0);
  });

  it('orders numeric-suffixed names naturally (Team 2 before Team 10)', () => {
    const two: EventAttendanceTeam = {
      teamId: 't-2',
      teamName: 'Team 2',
      attended: true,
    };
    const ten: EventAttendanceTeam = {
      teamId: 't-10',
      teamName: 'Team 10',
      attended: true,
    };
    expect(compareAttendanceTeams(two, ten)).toBeLessThan(0);
    expect(compareAttendanceTeams(ten, two)).toBeGreaterThan(0);
  });
});

describe('EventAttendance', () => {
  it('renders the title and both metric cards', () => {
    const { getByRole, getByText } = renderCard();
    // card title is "Attendance"; left metric label is "This event"
    expect(
      getByRole('heading', { level: 3, name: 'Attendance' }),
    ).toBeVisible();
    expect(getByText('This event')).toBeVisible();
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

  it('shows the no-previous-event empty state when there is nothing to compare', () => {
    const { getByText, queryByLabelText } = renderCard({
      sinceLastEvent: undefined,
    });
    expect(getByText('Since last event')).toBeVisible();
    expect(getByText('No previous event to compare to.')).toBeVisible();
    expect(queryByLabelText('Increase')).not.toBeInTheDocument();
    expect(queryByLabelText('Decrease')).not.toBeInTheDocument();
  });

  it('shows the no-change empty state when the delta is zero', () => {
    const { getByText, queryByLabelText } = renderCard({
      sinceLastEvent: { count: 0, teamsAttended: 18, teamsTotal: 25 },
    });
    expect(getByText('No change from 18 of 25 teams')).toBeVisible();
    expect(queryByLabelText('Increase')).not.toBeInTheDocument();
    expect(queryByLabelText('Decrease')).not.toBeInTheDocument();
  });

  it('orders teams: attended first, then active before inactive, then alphabetical', () => {
    const orderingTeams: EventAttendanceTeam[] = [
      { teamId: 'a', teamName: 'Zeta', attended: false },
      { teamId: 'b', teamName: 'Alpha', attended: true, isTeamInactive: true },
      { teamId: 'c', teamName: 'Beta', attended: true },
      { teamId: 'd', teamName: 'Gamma', attended: true },
      { teamId: 'e', teamName: 'Delta', attended: false, isTeamInactive: true },
    ];
    const { getAllByRole } = renderCard({
      teams: orderingTeams,
      teamsAttended: 3,
      teamsTotal: 5,
    });
    const names = getAllByRole('link').map((link) => link.textContent);
    expect(names).toEqual(['Beta', 'Gamma', 'Alpha', 'Zeta', 'Delta']);
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

  it('hides the header buttons when onExport and onEdit are not provided', () => {
    const { queryByLabelText } = renderCard();

    expect(queryByLabelText('Download attendance')).not.toBeInTheDocument();
    expect(queryByLabelText('Edit attendance')).not.toBeInTheDocument();
  });

  it('shows each header button independently of the other', () => {
    const { queryByLabelText, rerender } = renderCard({ onExport: jest.fn() });

    expect(queryByLabelText('Download attendance')).toBeVisible();
    expect(queryByLabelText('Edit attendance')).not.toBeInTheDocument();

    rerender(
      <StaticRouter location="/">
        <EventAttendance {...props} onEdit={jest.fn()} />
      </StaticRouter>,
    );

    expect(queryByLabelText('Download attendance')).not.toBeInTheDocument();
    expect(queryByLabelText('Edit attendance')).toBeVisible();
  });

  it('does not show the View More Attendees control for 10 or fewer teams', () => {
    const { queryByText } = renderCard();
    expect(queryByText('View More Attendees')).not.toBeInTheDocument();
  });

  // Natural (numeric) collation keeps Team 10/11/12 as the last three rows,
  // so no zero-padding workaround is needed.
  const manyTeams: EventAttendanceTeam[] = Array.from(
    { length: 12 },
    (_, index) => ({
      teamId: `t${index + 1}`,
      teamName: `Team ${index + 1}`,
      attended: true,
    }),
  );

  it('collapses to 10 teams and reveals the rest on View More Attendees', async () => {
    const { getByText, queryByText } = renderCard({ teams: manyTeams });

    expect(getByText('Team 10')).toBeInTheDocument();
    expect(queryByText('Team 11')).not.toBeInTheDocument();
    expect(queryByText('Team 12')).not.toBeInTheDocument();

    await userEvent.click(getByText('View More Attendees'));

    expect(getByText('Team 11')).toBeInTheDocument();
    expect(getByText('Team 12')).toBeInTheDocument();
    expect(queryByText('View More Attendees')).not.toBeInTheDocument();
    expect(getByText('View Less Attendees')).toBeInTheDocument();
  });

  it('collapses the extra rows again on View Less Attendees', async () => {
    const { getByText, queryByText } = renderCard({ teams: manyTeams });

    await userEvent.click(getByText('View More Attendees'));
    await userEvent.click(getByText('View Less Attendees'));

    expect(queryByText('Team 11')).not.toBeInTheDocument();
    expect(queryByText('Team 12')).not.toBeInTheDocument();
    expect(getByText('View More Attendees')).toBeInTheDocument();
  });

  it('shrinks the attendance column to its header so teams get the space', () => {
    const { container } = renderCard();
    const attendanceCol = container.querySelectorAll('col')[1];
    expect(attendanceCol).toHaveStyleRule('width', '1%');
  });

  it('adds a scroll gutter when the team table overflows horizontally', () => {
    mockTableOverflow(400, 100);
    const { getByRole } = renderCard();
    const wrapper = getByRole('table').parentElement as HTMLElement;
    expect(wrapper).toHaveStyleRule('padding-bottom', rem(8));
  });
});
