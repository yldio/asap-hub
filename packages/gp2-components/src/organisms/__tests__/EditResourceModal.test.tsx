import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Route, StaticRouter } from 'react-router-dom';
import EditResourceModal from '../EditResourceModal';

const { resource: resourceRoute } = gp2Routing;

type renderEditResourceModalProps = Partial<
  ComponentProps<typeof EditResourceModal>
> & { resourceIndex?: string };

const renderEditResourceModal = ({
  resources = [{ type: 'Note', title: 'a title' }],
  resourceIndex = '0',
  updateResources = jest.fn(),
}: renderEditResourceModalProps = {}) => {
  render(
    <StaticRouter location={resourceRoute({ resourceIndex }).$}>
      <Route path={resourceRoute.template}>
        <EditResourceModal
          backHref={'/back'}
          resources={resources}
          updateResources={updateResources}
          route={resourceRoute}
        />
      </Route>
    </StaticRouter>,
  );
};
describe('EditResource', () => {
  beforeEach(jest.restoreAllMocks);
  it('see if modal appears', () => {
    renderEditResourceModal();

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
    const title = 'a changed title';
    const updateResources = jest.fn();

    renderEditResourceModal({
      updateResources,
      resources,
    });

    const titleBox = screen.getByRole('textbox', { name: /title/i });
    userEvent.clear(titleBox);
    userEvent.type(titleBox, title);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(updateResources).toBeCalledWith([
      {
        ...resources[0],
        title,
      },
    ]);
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
    const updateResources = jest.fn();
    const resourceIndex = '1';

    renderEditResourceModal({
      updateResources,
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
    expect(updateResources).toBeCalledWith([
      resources[0],
      {
        ...resources[1],
        title,
      },
      resources[2],
    ]);
  });

  it('deletes the correct resource when multiple resources exist', async () => {
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
    const updateResources = jest.fn();
    const resourceIndex = '1';

    renderEditResourceModal({
      updateResources,
      resources,
      resourceIndex,
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => expect(deleteButton).toBeEnabled());
    expect(updateResources).toBeCalledWith([resources[0], resources[2]]);
  });
});
