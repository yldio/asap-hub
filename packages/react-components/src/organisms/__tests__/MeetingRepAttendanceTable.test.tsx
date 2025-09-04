import {
  MeetingRepAttendanceResponse,
  meetingRepAttendanceInitialSortingDirection,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import MeetingRepAttendanceTable from '../MeetingRepAttendanceTable';

describe('MeetingRepAttendanceTable', () => {
  const pageControlsProps = {
    numberOfPages: 3,
    currentPageIndex: 1,
    renderPageHref: (index: number) => `/page/${index}`,
  };

  const defaultProps: ComponentProps<typeof MeetingRepAttendanceTable> = {
    ...pageControlsProps,
    data: [],
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: meetingRepAttendanceInitialSortingDirection,
    setSortingDirection: jest.fn(),
  };

  const mockTeamData: MeetingRepAttendanceResponse = {
    teamId: 'team-1',
    teamName: 'Test Team Alpha',
    isTeamInactive: false,
    attendancePercentage: 85,
    limitedData: false,
  };

  const mockInactiveTeamData: MeetingRepAttendanceResponse = {
    teamId: 'team-2',
    teamName: 'Inactive Team Beta',
    isTeamInactive: true,
    attendancePercentage: 45,
    limitedData: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the StaticPerformanceCard', () => {
    render(<MeetingRepAttendanceTable {...defaultProps} />);
    expect(screen.getByText(/Outstanding/i)).toBeInTheDocument();
    expect(screen.getByText(/Adequate/i)).toBeInTheDocument();
    expect(screen.getByText(/Needs Improvement/i)).toBeInTheDocument();
    expect(screen.getByText(/Limited data/i)).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<MeetingRepAttendanceTable {...defaultProps} />);

    expect(
      screen.getByRole('columnheader', { name: 'Team' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Attendance' }),
    ).toBeInTheDocument();
  });

  it('renders multiple teams correctly', () => {
    const data = [mockTeamData, mockInactiveTeamData];
    render(<MeetingRepAttendanceTable {...defaultProps} data={data} />);

    expect(screen.getByText('Test Team Alpha')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Inactive Team Beta')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('renders team name as a link with correct href', () => {
    const data = [mockTeamData];
    render(<MeetingRepAttendanceTable {...defaultProps} data={data} />);

    const teamLink = screen.getByRole('link', { name: 'Test Team Alpha' });
    expect(teamLink).toBeInTheDocument();
    expect(teamLink).toHaveAttribute('href', '/network/teams/team-1');
  });

  it('renders inactive badge', () => {
    const data = [mockInactiveTeamData];
    render(<MeetingRepAttendanceTable {...defaultProps} data={data} />);

    expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
  });

  it('does not render inactive badge for active teams', () => {
    const data = [mockTeamData];
    render(<MeetingRepAttendanceTable {...defaultProps} data={data} />);

    expect(screen.queryByTitle('Inactive Team')).not.toBeInTheDocument();
  });

  it('renders PageControls with correct props', () => {
    render(<MeetingRepAttendanceTable {...defaultProps} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });

  it.each`
    sort                            | sortingDirection                                                                    | description
    ${'team_asc'}                   | ${{ ...meetingRepAttendanceInitialSortingDirection, team: 'asc' }}                  | ${'team ascending'}
    ${'team_desc'}                  | ${{ ...meetingRepAttendanceInitialSortingDirection, team: 'desc' }}                 | ${'team descending'}
    ${'attendance_percentage_asc'}  | ${{ ...meetingRepAttendanceInitialSortingDirection, attendancePercentage: 'asc' }}  | ${'attendance percentage ascending'}
    ${'attendance_percentage_desc'} | ${{ ...meetingRepAttendanceInitialSortingDirection, attendancePercentage: 'desc' }} | ${'attendance percentage descending'}
  `(
    'renders correctly with $description sorting',
    ({ sort, sortingDirection }) => {
      const setSort = jest.fn();
      const setSortingDirection = jest.fn();

      render(
        <MeetingRepAttendanceTable
          {...defaultProps}
          data={[mockTeamData, mockInactiveTeamData]}
          sort={sort}
          setSort={setSort}
          sortingDirection={sortingDirection}
          setSortingDirection={setSortingDirection}
        />,
      );

      expect(screen.getByText('Test Team Alpha')).toBeInTheDocument();
      expect(screen.getByText('Inactive Team Beta')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    },
  );
});
