import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FiltersModal } from '../..';

const { userRegions, keywords } = gp2Model;

describe('FiltersModal', () => {
  const defaultProps = {
    onBackClick: jest.fn(),
    onApplyClick: jest.fn(),
    filters: {},
    projects: [],
    workingGroups: [],
  };
  const projects: gp2Model.ProjectResponse[] = [
    {
      id: '42',
      title: 'The HHG Project',
      keywords: [],
      milestones: [],
      members: [],
      startDate: '2021-12-28',
      status: 'Inactive',
    },
  ];
  const workingGroups: gp2Model.WorkingGroupResponse[] = [
    {
      id: '11',
      title: 'a working group',
      members: [],
      shortDescription: '',
      description: '',
    },
  ];
  const getRegionsField = () =>
    screen.getByRole('textbox', { name: 'Regions' });
  const getExpertiseField = () =>
    screen.getByRole('textbox', { name: 'Expertise / Interests' });
  const getProjectsField = () =>
    screen.getByRole('textbox', { name: 'Projects' });
  const getWorkingGroupsField = () =>
    screen.getByRole('textbox', { name: 'Working Groups' });
  const getApplyButton = () => screen.getByRole('button', { name: 'Apply' });
  beforeEach(jest.resetAllMocks);
  it('renders the header', () => {
    render(<FiltersModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
  });
  it('renders the footer', () => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toEqual(expect.arrayContaining(['Close', 'Reset', 'Apply']));
  });
  it.each(['Expertise / Interests', 'Regions', 'Working Groups', 'Projects'])(
    'renders the %s input field',
    (fieldName) => {
      render(<FiltersModal {...defaultProps} />);
      expect(screen.getByRole('textbox', { name: fieldName })).toBeVisible();
    },
  );
  it.each(userRegions)('%s region is selectable', (region) => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getRegionsField());
    userEvent.click(screen.getByText(region));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for regions', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getRegionsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current regions match "lt"/i),
    ).toBeVisible();
  });
  it.each(keywords)('%s expertise is selectable', (keyword) => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getExpertiseField());
    userEvent.click(screen.getByText(keyword));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for expertise', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getExpertiseField(), 'LT');
    expect(
      screen.getByText(/sorry, no current expertise \/ interests match "lt"/i),
    ).toBeVisible();
  });
  it('projects are selectable', () => {
    render(<FiltersModal {...defaultProps} projects={projects} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getProjectsField());
    userEvent.click(screen.getByText(projects[0].title));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for projects', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getProjectsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current projects match "lt"/i),
    ).toBeVisible();
  });
  it('working groups are selectable', () => {
    render(<FiltersModal {...defaultProps} workingGroups={workingGroups} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    userEvent.click(getWorkingGroupsField());
    userEvent.click(screen.getByText(workingGroups[0].title));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for working groups', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.type(getWorkingGroupsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current working groups match "lt"/i),
    ).toBeVisible();
  });
  it('calls the onBackClick function on close', () => {
    render(<FiltersModal {...defaultProps} />);
    const closeButton = screen.getAllByRole('button', { name: 'Close' })[1];
    expect(closeButton).toBeVisible();
    userEvent.click(closeButton);
    expect(defaultProps.onBackClick).toHaveBeenCalledTimes(1);
  });
  it('calls the onApplyClick function on apply', () => {
    render(<FiltersModal {...defaultProps} />);
    const applyButton = getApplyButton();
    expect(applyButton).toBeVisible();
    userEvent.click(applyButton);
    expect(defaultProps.onApplyClick).toHaveBeenCalledTimes(1);
  });
  it('calls the onApplyClick function with correct region filters', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.click(getRegionsField());
    userEvent.click(screen.getByText('Asia'));
    userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      region: ['Asia'],
      keyword: [],
      project: [],
      workingGroup: [],
    });
  });
  it('calls the onApplyClick function with correct expertise filters', () => {
    render(<FiltersModal {...defaultProps} />);
    userEvent.click(getExpertiseField());
    userEvent.click(screen.getByText('R'));
    userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      region: [],
      keyword: ['R'],
      project: [],
      workingGroup: [],
    });
  });
  it('calls the onApplyClick function with correct project filters', () => {
    render(<FiltersModal {...defaultProps} projects={projects} />);
    userEvent.click(getProjectsField());
    userEvent.click(screen.getByText(projects[0].title));
    userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      region: [],
      keyword: [],
      project: [projects[0].id],
      workingGroup: [],
    });
  });
  it('calls the onApplyClick function with correct working group filters', () => {
    render(<FiltersModal {...defaultProps} workingGroups={workingGroups} />);
    userEvent.click(getWorkingGroupsField());
    userEvent.click(screen.getByText(workingGroups[0].title));
    userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      region: [],
      keyword: [],
      project: [],
      workingGroup: [workingGroups[0].id],
    });
  });

  it.each`
    name               | getField                 | value
    ${'region'}        | ${getRegionsField}       | ${'Asia'}
    ${'expertise'}     | ${getExpertiseField}     | ${'Bash'}
    ${'project'}       | ${getProjectsField}      | ${projects[0].title}
    ${'working group'} | ${getWorkingGroupsField} | ${workingGroups[0].title}
  `('resets selected filter, $name, on Reset', ({ getField, value }) => {
    render(
      <FiltersModal
        {...defaultProps}
        projects={projects}
        workingGroups={workingGroups}
      />,
    );
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    expect(resetButton).toBeVisible();
    userEvent.click(getField());
    userEvent.click(screen.getByText(value));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain('1 filter');
    userEvent.click(resetButton);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
  });

  it.each`
    name              | value                  | expected
    ${'keyword'}      | ${'Bash'}              | ${'Bash'}
    ${'region'}       | ${'Asia'}              | ${'Asia'}
    ${'project'}      | ${projects[0].id}      | ${projects[0].title}
    ${'workingGroup'} | ${workingGroups[0].id} | ${workingGroups[0].title}
  `('displays current filter $name', ({ name, value, expected }) => {
    const filters: gp2Model.FetchUsersFilter = {
      [name]: [value],
    };
    render(
      <FiltersModal
        {...defaultProps}
        projects={projects}
        workingGroups={workingGroups}
        filters={filters}
      />,
    );
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain('1 filter');
    expect(screen.getByText(expected)).toBeVisible();
  });
});
