import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPageList from '../UsersPageList';

const props = {
  users: {
    items: [
      {
        id: 'u42',
        displayName: 'John Doe',
        createdDate: '',
        email: 'some@email',
        degree: ['PhD'],
        firstName: 'John',
        lastName: 'Doe',
        avatarUrl: '',
        role: 'Administrator' as const,
        region: 'Europe' as const,
        workingGroups: [{ id: 0, name: 'Underrepresented Populations' }],
        projects: [
          { id: 0, name: 'Genetic determinants of progression in PD' },
        ],
        tags: [
          'Neurological Diseases',
          'Clinical Neurology',
          'Adult Neurology',
          'Neuroimaging',
          'Neurologic Examination',
          'Neuroprotection',
          'Movement Disorders',
          'Neurodegenerative Diseases',
          'Neurological Diseases',
        ],
      },
    ],
    total: 1,
  },
  searchQuery: '',
  onSearchQueryChange: jest.fn(),
  isAdministrator: true,
  onFiltersClick: jest.fn(),
  onExportClick: jest.fn(),
  changeLocation: jest.fn(),
  updateFilters: jest.fn(),
  filters: {},
  projects: [],
  workingGroups: [],
  tags: [],
};

describe('UsersPageList', () => {
  it('does not render the filters', () => {
    render(<UsersPageList {...props} />);
    expect(
      screen.queryByRole('heading', { name: 'Filters' }),
    ).not.toBeInTheDocument();
  });
  it('renders the filters', () => {
    render(<UsersPageList {...props} displayFilters />);
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
  });
  it.each`
    name               | value
    ${'regions'}       | ${'Asia'}
    ${'tags'}          | ${'11'}
    ${'projects'}      | ${'42'}
    ${'workingGroups'} | ${'42'}
  `(
    'calls the updateFilters with the right arguments for $name',
    async ({ name, value }) => {
      const filters = { [name]: [value] };
      const updateFilterSpy = jest.fn();

      const { items: projects } = gp2Fixtures.createProjectsResponse();
      const { items: workingGroups } =
        gp2Fixtures.createWorkingGroupsResponse();
      const { items: tags } = gp2Fixtures.createTagsResponse();

      render(
        <UsersPageList
          {...props}
          displayFilters
          filters={filters}
          updateFilters={updateFilterSpy}
          projects={projects}
          workingGroups={workingGroups}
          tags={tags}
        />,
      );

      userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(updateFilterSpy).toHaveBeenCalledWith('/users', {
        regions: [],
        tags: [],
        projects: [],
        workingGroups: [],
        [name]: [value],
      });
    },
  );
  it('calls the updateFilters with the right arguments for removing a certain filter', () => {
    const filters: gp2Model.FetchUsersFilter = {
      regions: ['Asia'],
      tags: [],
      projects: [],
      workingGroups: [],
    };
    const updateFilterSpy = jest.fn();

    const { items: projects } = gp2Fixtures.createProjectsResponse();
    const { items: workingGroups } = gp2Fixtures.createWorkingGroupsResponse();
    render(
      <UsersPageList
        {...props}
        filters={filters}
        updateFilters={updateFilterSpy}
        projects={projects}
        workingGroups={workingGroups}
      />,
    );

    const onRemoveButton = screen.getByRole('button', { name: /cross/i });

    userEvent.click(onRemoveButton);

    expect(updateFilterSpy).toHaveBeenCalledWith('/users', {
      regions: [],
      tags: [],
      projects: [],
      workingGroups: [],
    });
  });
});
