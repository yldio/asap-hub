import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  const props = {
    filters: {
      keywords: ['keyword-1'],
      regions: ['Asia'],
      projects: ['project-1'],
      workingGroups: ['working-group-1'],
    } as ComponentProps<typeof FilterPills>['filters'],
    projects: [{ id: 'project-1', title: 'Project 1' }],
    workingGroups: [{ id: 'working-group-1', title: 'Working Group 1' }],
    keywords: [{ id: 'keyword-1', name: 'Keyword 1' }],
    onRemove: jest.fn(),
  };
  it('should render all the pills', () => {
    render(<FilterPills {...props} />);
    expect(screen.getByText('Keyword 1')).toBeVisible();
    expect(screen.getByText('Asia')).toBeVisible();
    expect(screen.getByText('Project 1')).toBeVisible();
    expect(screen.getByText('Working Group 1')).toBeVisible();
  });
  it('calls the onRemove function for every pill with their respective id and type of filter', () => {
    render(<FilterPills {...props} />);
    const onRemoveKeywordButton =
      screen.getByText('Keyword 1').nextElementSibling!;
    const onRemoveRegionButton = screen.getByText('Asia').nextElementSibling!;
    const onRemoveProjectButton =
      screen.getByText('Project 1').nextElementSibling!;
    const onRemoveWorkingGroupButton =
      screen.getByText('Working Group 1').nextElementSibling!;

    expect(onRemoveKeywordButton).toBeVisible();
    expect(onRemoveRegionButton).toBeVisible();
    expect(onRemoveProjectButton).toBeVisible();
    expect(onRemoveWorkingGroupButton).toBeVisible();

    userEvent.click(onRemoveKeywordButton);
    expect(props.onRemove).toBeCalledWith('keyword-1', 'keywords');

    userEvent.click(onRemoveRegionButton);
    expect(props.onRemove).toBeCalledWith('Asia', 'regions');

    userEvent.click(onRemoveProjectButton);
    expect(props.onRemove).toBeCalledWith('project-1', 'projects');

    userEvent.click(onRemoveWorkingGroupButton);
    expect(props.onRemove).toBeCalledWith('working-group-1', 'workingGroups');
  });
});
