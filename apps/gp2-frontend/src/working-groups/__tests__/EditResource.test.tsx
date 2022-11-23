import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import EditResource from '../EditResource';

const renderWorkingGroupDetail = async () => {
  const workingGroup = gp2Fixtures.createWorkingGroupResponse();
  const { id: workingGroupId } = workingGroup;
  const props = {
    workingGroupId,
    workingGroup,
    backHref: '/back',
    updateWorkingGroupResources: jest.fn(),
  };
  render(
    <MemoryRouter
      initialEntries={[
        gp2Routing.workingGroups({}).workingGroup({ workingGroupId }).$,
      ]}
    >
      <Route
        path={
          gp2Routing.workingGroups.template +
          gp2Routing.workingGroups({}).workingGroup.template
        }
      >
        <EditResource {...props} />
      </Route>
    </MemoryRouter>,
  );
};

describe('edit resources', () => {
  it('see if modal appears', async () => {
    await renderWorkingGroupDetail();

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('see if content is empty', async () => {
    await renderWorkingGroupDetail();

    expect(
      screen.getByRole('textbox', { name: 'Resource Type (required)' }),
    ).toHaveValue('');
  });

  it('can submit a form when form data is valid for editing', async () => {
    const title = 'example42 title';
    const type = 'Note';

    await renderWorkingGroupDetail();

    const typeBox = await screen.findByRole('textbox', { name: /type/i });
    userEvent.type(typeBox, `${type}{enter}`);
    const titleBox = screen.getByRole('textbox', { name: /title/i });
    userEvent.type(titleBox, title);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
