import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import FilterPills from '../FilterPills';

describe('FilterPills', () => {
  beforeEach(jest.resetAllMocks);
  const props = {
    filters: {
      keywords: [],
      regions: ['Asia', 'Africa'],
      projects: [],
      workingGroups: [],
    } as ComponentProps<typeof FilterPills>['filters'],
    projects: gp2Fixtures
      .createProjectsResponse()
      .items.map(({ id, title }) => ({
        id,
        title,
      })),
    workingGroups: gp2Fixtures
      .createWorkingGroupsResponse()
      .items.map(({ id, title }) => ({
        id,
        title,
      })),
    onRemove: jest.fn(),
  };
  it('should render all the pills', () => {
    render(<FilterPills {...props} />);
    expect(screen.getByText('Asia')).toBeVisible();
    expect(screen.getByText('Africa')).toBeVisible();
  });
  it("shows the remove button for the second pill and it's clickable", () => {
    render(<FilterPills {...props} />);
    const onRemoveButton = screen.getByText('Africa').nextElementSibling!;
    expect(onRemoveButton).toBeVisible();
    userEvent.click(onRemoveButton);
    expect(props.onRemove).toBeCalledWith('Africa', 'regions');
  });
});
