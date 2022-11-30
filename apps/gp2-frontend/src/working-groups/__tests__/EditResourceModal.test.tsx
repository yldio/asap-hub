import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { ComponentProps } from 'react';
import EditResourceModal from '../EditResourceModal';

type renderEditResourceModalProps = Partial<
  ComponentProps<typeof EditResourceModal>
> & { resourceIndex?: string };

const renderEditResourceModal = ({
  resourceIndex = '0',
  resources = gp2Fixtures.createWorkingGroupResponse().resources,
  updateWorkingGroupResources = jest.fn(),
}: renderEditResourceModalProps = {}) => {
  const workingGroupId = '7';
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
          gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId })
            .resources({})
            .edit({}).$ +
          gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId })
            .resources({})
            .edit({}).resource.template
        }
      >
        <EditResourceModal
          workingGroupId={workingGroupId}
          backHref={'/back'}
          resources={resources}
          updateWorkingGroupResources={updateWorkingGroupResources}
        />
      </Route>
    </MemoryRouter>,
  );
};

describe('EditResource', () => {
  beforeEach(jest.restoreAllMocks);
  it('see if modal appears', async () => {
    renderEditResourceModal();

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
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
    const title = 'a changed title';
    const updateWorkingGroupResources = jest.fn();

    renderEditResourceModal({
      updateWorkingGroupResources,
      resources,
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
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '0';

    renderEditResourceModal({
      updateWorkingGroupResources,
      resources,
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
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '1';

    renderEditResourceModal({
      updateWorkingGroupResources,
      resources,
      resourceIndex,
    });

    expect(updateWorkingGroupResources).not.toBeCalled();

    expect(
      screen.getByRole('heading', {
        name: /Sorry! We can’t seem to find that page/i,
      }),
    ).toBeVisible();
  });
  it('updates the correct resource when multiple resources exist', async () => {
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
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '1';

    renderEditResourceModal({
      updateWorkingGroupResources,
      resources,
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

  it('erases the correct resource when multiple resources exist', async () => {
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
    const updateWorkingGroupResources = jest.fn();
    const resourceIndex = '1';

    renderEditResourceModal({
      updateWorkingGroupResources,
      resources,
      resourceIndex,
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => expect(deleteButton).toBeEnabled());
    expect(updateWorkingGroupResources).toBeCalledWith([
      resources[0],
      resources[2],
    ]);
  });
});
