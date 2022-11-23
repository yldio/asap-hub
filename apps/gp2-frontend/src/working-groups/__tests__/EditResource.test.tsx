import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentProps } from 'react';
import EditResource from '../EditResource';

const renderWorkingGroupDetail = async ({
  workingGroup = gp2Fixtures.createWorkingGroupResponse(),
  updateWorkingGroupResources = jest.fn(),
}: Partial<ComponentProps<typeof EditResource>> = {}) => {
  const { id: workingGroupId } = workingGroup;
  const props = {
    workingGroupId,
    backHref: '/back',
  };
  render(
    <MemoryRouter
      initialEntries={[
        gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId })
          .resources({})
          .edit({})
          .resource({ resourceIndex: '0' }).$,
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
          {...props}
          workingGroup={workingGroup}
          updateWorkingGroupResources={updateWorkingGroupResources}
        />
      </Route>
    </MemoryRouter>,
  );
};

describe('EditResource', () => {
  it('see if modal appears', async () => {
    await renderWorkingGroupDetail();

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

    await renderWorkingGroupDetail({
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
});
