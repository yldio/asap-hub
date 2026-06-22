import { disable, enable, reset } from '@asap-hub/flags';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  beforeEach(() => {
    enable('STAGING_MODE');
  });
  afterEach(() => {
    reset();
  });

  const props = {
    filters: {
      tags: ['tag-1'],
      regions: ['Asia'],
      projects: ['project-1'],
      workingGroups: ['working-group-1'],
      membershipStatus: ['Alumni Member'],
    } as ComponentProps<typeof FilterPills>['filters'],
    projects: [{ id: 'project-1', title: 'Project 1' }],
    workingGroups: [{ id: 'working-group-1', title: 'Working Group 1' }],
    tags: [{ id: 'tag-1', name: 'Tag 1' }],
    onRemove: jest.fn(),
  };
  it('should render all the pills', () => {
    render(<FilterPills {...props} />);
    expect(screen.getByText('Tag 1')).toBeVisible();
    expect(screen.getByText('Asia')).toBeVisible();
    expect(screen.getByText('Project 1')).toBeVisible();
    expect(screen.getByText('Working Group 1')).toBeVisible();
    expect(screen.getByText('Alumni Member')).toBeVisible();
  });
  it('calls the onRemove function for every pill with their respective id and type of filter', async () => {
    render(<FilterPills {...props} />);
    const onRemoveTagButton = screen.getByText('Tag 1').nextElementSibling!;
    const onRemoveRegionButton = screen.getByText('Asia').nextElementSibling!;
    const onRemoveProjectButton =
      screen.getByText('Project 1').nextElementSibling!;
    const onRemoveWorkingGroupButton =
      screen.getByText('Working Group 1').nextElementSibling!;
    const onRemoveMembershipStatusButton =
      screen.getByText('Alumni Member').nextElementSibling!;

    expect(onRemoveTagButton).toBeVisible();
    expect(onRemoveRegionButton).toBeVisible();
    expect(onRemoveProjectButton).toBeVisible();
    expect(onRemoveWorkingGroupButton).toBeVisible();
    expect(onRemoveMembershipStatusButton).toBeVisible();

    await userEvent.click(onRemoveTagButton);
    expect(props.onRemove).toHaveBeenCalledWith('tag-1', 'tags');

    await userEvent.click(onRemoveRegionButton);
    expect(props.onRemove).toHaveBeenCalledWith('Asia', 'regions');

    await userEvent.click(onRemoveProjectButton);
    expect(props.onRemove).toHaveBeenCalledWith('project-1', 'projects');

    await userEvent.click(onRemoveWorkingGroupButton);
    expect(props.onRemove).toHaveBeenCalledWith(
      'working-group-1',
      'workingGroups',
    );

    await userEvent.click(onRemoveMembershipStatusButton);
    expect(props.onRemove).toHaveBeenCalledWith(
      'Alumni Member',
      'membershipStatus',
    );
  });
  it('does not render the membership status pill when STAGING_MODE is disabled', () => {
    disable('STAGING_MODE');
    render(<FilterPills {...props} />);
    expect(screen.queryByText('Alumni Member')).not.toBeInTheDocument();
  });
});
