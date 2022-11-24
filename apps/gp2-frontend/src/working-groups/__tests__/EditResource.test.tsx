import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentProps } from 'react';
import EditResource from '../EditResource';

type renderWorkingGroupDetailProps = Partial<
  ComponentProps<typeof EditResource>
> & { resourceIndex?: string };

const renderWorkingGroupDetail = ({
  resourceIndex = '0',
  workingGroup = gp2Fixtures.createWorkingGroupResponse(),
  updateWorkingGroupResources = jest.fn(),
}: renderWorkingGroupDetailProps = {}) => {
  const { id: workingGroupId } = workingGroup;
  render(
    <MemoryRouter
      initialEntries={[
        gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .resources({})
          .edit({})
          .resource({ resourceIndex }).$,
      ]}
    >
      <Route
        path={
          gp2Routing.workingGroups.template +
          gp2Routing.workingGroups({}).workingGroup.template +
          gp2Routing.workingGroups({}).workingGroup({ workingGroupId })
            .resources.template +
          gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId })
            .resources({}).edit.template +
          gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId })
            .resources({})
            .edit({}).resource.template
        }
      >
        <EditResource
          backHref={'/back'}
          workingGroupId={workingGroupId}
          workingGroup={workingGroup}
          updateWorkingGroupResources={updateWorkingGroupResources}
        />
      </Route>
    </MemoryRouter>,
  );
};

describe('EditResource', () => {
  beforeEach(jest.restoreAllMocks);
  it('see if modal appears', async () => {
    renderWorkingGroupDetail();

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Edit Resource/ }),
    ).toBeVisible();
  });

  it('can submit a form when form data is valid for editing', async () => {
    const resources: gp2Model.Resource[] = [
      {
        type: 'Note',
        title: 'first resource',
      },
    ];
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.resources = resources;
    const title = 'a changed title';
    const updateWorkingGroupResources = jest.fn();

    renderWorkingGroupDetail({
      updateWorkingGroupResources,
      workingGroup,
    });

    const titleBox = screen.getByRole('textbox', { name: /title/i });
    userEvent.clear(titleBox);
    userEvent.type(titleBox, title);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(updateWorkingGroupResources).toBeCalledWith([
      {
        ...resources[0],
        title,
      },
    ]);
  });
  it('throws (Not Found) if there are no resources', () => {
    const resources: gp2Model.Resource[] = [];
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.resources = resources;
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '0';

    renderWorkingGroupDetail({
      updateWorkingGroupResources,
      workingGroup,
      resourceIndex,
    });

    expect(updateWorkingGroupResources).not.toBeCalled();

    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });
  it('throws (Not Found) if we cannot find the correct working resource', async () => {
    const resources: gp2Model.Resource[] = [
      {
        type: 'Note',
        title: 'first resource',
      },
    ];
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.resources = resources;
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '1';

    renderWorkingGroupDetail({
      updateWorkingGroupResources,
      workingGroup,
      resourceIndex,
    });

    expect(updateWorkingGroupResources).not.toBeCalled();

    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });
  it.only('updates the correct resource when multiple resources exist', async () => {
    const resources: gp2Model.Resource[] = [
      {
        type: 'Note',
        title: 'first resource',
      },
      {
        type: 'Note',
        title: 'second resource',
      },
      {
        type: 'Note',
        title: 'third resource',
      },
    ];
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.resources = resources;
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '1';

    renderWorkingGroupDetail({
      updateWorkingGroupResources,
      workingGroup,
      resourceIndex,
    });

    const title = 'a changed title';

    const titleBox = screen.getByRole('textbox', { name: /title/i });
    userEvent.clear(titleBox);
    userEvent.type(titleBox, title);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(updateWorkingGroupResources).toBeCalledWith([
      resources[0],
      {
        ...resources[1],
        title,
      },
      resources[2],
    ]);
  });
});
