import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FiltersModal from '../FiltersModal';

const { userRegions } = gp2Model;

describe('FiltersModal', () => {
  const defaultProps = {
    onBackClick: jest.fn(),
    onApplyClick: jest.fn(),
    filters: {},
    projects: [],
    workingGroups: [],
    tags: [],
  };
  const projects: ComponentProps<typeof FiltersModal>['projects'] = [
    {
      id: '42',
      title: 'The HHG Project',
    },
  ];
  const workingGroups: ComponentProps<typeof FiltersModal>['workingGroups'] = [
    {
      id: '11',
      title: 'a working group',
    },
  ];
  const tags: ComponentProps<typeof FiltersModal>['tags'] = [
    { id: '32', name: 'Data Science' },
  ];
  const getRegionsField = () =>
    screen.getByRole('combobox', { name: 'Regions' });
  const getExpertiseField = () =>
    screen.getByRole('combobox', { name: 'Expertise / Interests' });
  const getProjectsField = () =>
    screen.getByRole('combobox', { name: 'Projects' });
  const getWorkingGroupsField = () =>
    screen.getByRole('combobox', { name: 'Working Groups' });
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
      expect(screen.getByRole('combobox', { name: fieldName })).toBeVisible();
    },
  );
  it.each(userRegions)('%s region is selectable', async (region) => {
    render(<FiltersModal {...defaultProps} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    await userEvent.click(getRegionsField());
    await userEvent.click(screen.getByText(region));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for regions', async () => {
    render(<FiltersModal {...defaultProps} />);
    await userEvent.type(getRegionsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current regions match "lt"/i),
    ).toBeVisible();
  });
  it('should select an expertise', async () => {
    render(<FiltersModal {...defaultProps} tags={tags} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    await userEvent.click(getExpertiseField());
    await userEvent.type(getExpertiseField(), 'Data');
    await userEvent.click(screen.getByText('Data Science'));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for expertise', async () => {
    render(<FiltersModal {...defaultProps} tags={tags} />);
    await userEvent.type(getExpertiseField(), 'LTX');
    expect(
      screen.getByText(/sorry, no current expertise \/ interests match "ltx"/i),
    ).toBeVisible();
  });
  it('projects are selectable', async () => {
    render(<FiltersModal {...defaultProps} projects={projects} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    await userEvent.click(getProjectsField());
    await userEvent.click(screen.getByText(projects[0]!.title));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for projects', async () => {
    render(<FiltersModal {...defaultProps} />);
    await userEvent.type(getProjectsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current projects match "lt"/i),
    ).toBeVisible();
  });
  it('working groups are selectable', async () => {
    render(<FiltersModal {...defaultProps} workingGroups={workingGroups} />);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    await userEvent.click(getWorkingGroupsField());
    await userEvent.click(screen.getByText(workingGroups[0]!.title));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`1 filter`);
  });
  it('renders the no options message for working groups', async () => {
    render(<FiltersModal {...defaultProps} />);
    await userEvent.type(getWorkingGroupsField(), 'LT');
    expect(
      screen.getByText(/sorry, no current working groups match "lt"/i),
    ).toBeVisible();
  });
  it('calls the onBackClick function on close', async () => {
    render(<FiltersModal {...defaultProps} />);
    const closeButton = screen.getAllByRole('button', { name: 'Close' })[1]!;
    expect(closeButton).toBeVisible();
    await userEvent.click(closeButton);
    expect(defaultProps.onBackClick).toHaveBeenCalledTimes(1);
  });
  it('calls the onApplyClick function on apply', async () => {
    render(<FiltersModal {...defaultProps} />);
    const applyButton = getApplyButton();
    expect(applyButton).toBeVisible();
    await userEvent.click(applyButton);
    expect(defaultProps.onApplyClick).toHaveBeenCalledTimes(1);
  });
  it('calls the onApplyClick function with correct region filters', async () => {
    render(<FiltersModal {...defaultProps} />);
    await userEvent.click(getRegionsField());
    await userEvent.click(screen.getByText('Asia'));
    await userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      regions: ['Asia'],
      tags: [],
      projects: [],
      workingGroups: [],
    });
  });
  it('calls the onApplyClick function with correct expertise filters', async () => {
    render(<FiltersModal {...defaultProps} tags={tags} />);
    await userEvent.click(getExpertiseField());
    await userEvent.click(screen.getByText('Data Science'));
    await userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      regions: [],
      tags: [tags[0]!.id],
      projects: [],
      workingGroups: [],
    });
  });
  it('calls the onApplyClick function with correct project filters', async () => {
    render(<FiltersModal {...defaultProps} projects={projects} />);
    await userEvent.click(getProjectsField());
    await userEvent.click(screen.getByText(projects[0]!.title));
    await userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      regions: [],
      tags: [],
      projects: [projects[0]!.id],
      workingGroups: [],
    });
  });
  it('calls the onApplyClick function with correct working group filters', async () => {
    render(<FiltersModal {...defaultProps} workingGroups={workingGroups} />);
    await userEvent.click(getWorkingGroupsField());
    await userEvent.click(screen.getByText(workingGroups[0]!.title));
    await userEvent.click(getApplyButton());
    expect(defaultProps.onApplyClick).toHaveBeenCalledWith({
      regions: [],
      tags: [],
      projects: [],
      workingGroups: [workingGroups[0]!.id],
    });
  });

  it.each`
    name               | getField                 | value
    ${'region'}        | ${getRegionsField}       | ${'Asia'}
    ${'expertise'}     | ${getExpertiseField}     | ${tags[0]!.name}
    ${'project'}       | ${getProjectsField}      | ${projects[0]!.title}
    ${'working group'} | ${getWorkingGroupsField} | ${workingGroups[0]!.title}
  `('resets selected filter, $name, on Reset', async ({ getField, value }) => {
    render(
      <FiltersModal
        {...defaultProps}
        projects={projects}
        workingGroups={workingGroups}
        tags={tags}
      />,
    );
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
    expect(resetButton).toBeVisible();
    await userEvent.click(getField());
    await userEvent.click(screen.getByText(value));
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain('1 filter');
    await userEvent.click(resetButton);
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain(`0 filters`);
  });

  it.each`
    name               | value                   | expected
    ${'tags'}          | ${tags[0]!.id}          | ${tags[0]!.name}
    ${'regions'}       | ${'Asia'}               | ${'Asia'}
    ${'projects'}      | ${projects[0]!.id}      | ${projects[0]!.title}
    ${'workingGroups'} | ${workingGroups[0]!.id} | ${workingGroups[0]!.title}
  `('displays current filter $name', ({ name, value, expected }) => {
    const filters: gp2Model.FetchUsersFilter = {
      [name]: [value],
    };
    render(
      <FiltersModal
        {...defaultProps}
        projects={projects}
        workingGroups={workingGroups}
        tags={tags}
        filters={filters}
      />,
    );
    expect(
      screen.getByText(/Apply filters to narrow down your search results.*/i)
        .textContent,
    ).toContain('1 filter');
    expect(screen.getByText(expected)).toBeVisible();
  });
  describe('sorting', () => {
    it('sorts tag', async () => {
      const tagList = [
        {
          id: '42',
          name: 'TagB',
        },
        {
          id: '27',
          name: 'TagC',
        },
        {
          id: '11',
          name: 'TagA',
        },
      ];
      render(<FiltersModal {...defaultProps} tags={tagList} />);
      await userEvent.click(getExpertiseField());
      const options = screen.getByText('TagA').parentElement?.childNodes || [];
      expect(options[0]!).toHaveTextContent('TagA');
      expect(options[1]).toHaveTextContent('TagB');
      expect(options[2]).toHaveTextContent('TagC');
    });
    it('sorts projects', async () => {
      const projectsList = [
        {
          id: '42',
          title: 'ProjectB',
        },
        {
          id: '27',
          title: 'ProjectC',
        },
        {
          id: '11',
          title: 'ProjectA',
        },
      ];
      render(<FiltersModal {...defaultProps} projects={projectsList} />);
      await userEvent.click(getProjectsField());
      const options =
        screen.getByText('ProjectA').parentElement?.childNodes || [];
      expect(options[0]!).toHaveTextContent('ProjectA');
      expect(options[1]).toHaveTextContent('ProjectB');
      expect(options[2]).toHaveTextContent('ProjectC');
    });
    it('sorts working groups', async () => {
      const workingGroupList = [
        {
          id: '42',
          title: 'GroupB',
        },
        {
          id: '27',
          title: 'GroupC',
        },
        {
          id: '11',
          title: 'GroupA',
        },
      ];
      render(
        <FiltersModal {...defaultProps} workingGroups={workingGroupList} />,
      );
      await userEvent.click(getWorkingGroupsField());
      const options =
        screen.getByText('GroupA').parentElement?.childNodes || [];
      expect(options[0]!).toHaveTextContent('GroupA');
      expect(options[1]).toHaveTextContent('GroupB');
      expect(options[2]).toHaveTextContent('GroupC');
    });
    it('sorts expertise', async () => {
      const workingGroupList = [
        {
          id: '42',
          title: 'GroupB',
        },
        {
          id: '27',
          title: 'GroupC',
        },
        {
          id: '11',
          title: 'GroupA',
        },
      ];
      render(
        <FiltersModal {...defaultProps} workingGroups={workingGroupList} />,
      );
      await userEvent.click(getWorkingGroupsField());
      const options =
        screen.getByText('GroupA').parentElement?.childNodes || [];
      expect(options[0]!).toHaveTextContent('GroupA');
      expect(options[1]).toHaveTextContent('GroupB');
      expect(options[2]).toHaveTextContent('GroupC');
    });
  });
});
