import { createUserResponse } from '@asap-hub/fixtures';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import RoleModal from '../RoleModal';

const props: ComponentProps<typeof RoleModal> = {
  ...createUserResponse({ teams: 1, labs: 1 }),
  role: 'Grantee',
  backHref: '/wrong',
};

it('renders the title', () => {
  const { getByText } = render(
    <StaticRouter>
      <RoleModal {...props} />
    </StaticRouter>,
  );
  expect(getByText('Role', { selector: 'h3' })).toBeVisible();
});

it('renders teams and lan names into inputs', async () => {
  const { getByLabelText, getAllByLabelText } = render(
    <StaticRouter>
      <RoleModal
        {...props}
        researchInterests={undefined}
        responsibilities={undefined}
        labs={[
          { name: 'Lab 1', id: 'lab-1' },
          { name: 'Lab 2', id: 'lab-2' },
        ]}
        teams={[
          { displayName: 'Team 1', id: 'team-1', role: 'Collaborating PI' },
          { displayName: 'Team 2', id: 'team-2', role: 'Collaborating PI' },
        ]}
      />
    </StaticRouter>,
  );
  expect(getByLabelText(/main.+interests/i)).toHaveValue('');
  expect(getByLabelText(/responsibilities/i)).toHaveValue('');
  expect(getAllByLabelText(/team/i)).toHaveLength(2);
  expect(getAllByLabelText(/team/i)[0]).toHaveValue('Team 1');
  expect(getAllByLabelText(/team/i)[1]).toHaveValue('Team 2');

  expect(getAllByLabelText(/lab/i)).toHaveLength(2);
  expect(getAllByLabelText(/lab/i)[0]).toHaveValue('Lab 1');
  expect(getAllByLabelText(/lab/i)[1]).toHaveValue('Lab 2');
});

describe('User Role', () => {
  it('indicates which fields are required or optional', () => {
    const { getByText } = render(
      <StaticRouter>
        <RoleModal {...props} />
      </StaticRouter>,
    );
    expect(getByText(/research interests/i).nextSibling).toHaveTextContent(
      'required',
    );
    expect(getByText(/responsibilities/i).nextSibling).toHaveTextContent(
      'required',
    );
  });

  it('triggers the save function', async () => {
    const mockSaveFn = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <StaticRouter>
        <RoleModal
          {...props}
          reachOut={undefined}
          researchInterests="interests"
          responsibilities="responsibilities"
          onSave={mockSaveFn}
        />
      </StaticRouter>,
    );

    userEvent.type(getByDisplayValue('interests'), ' 1');
    userEvent.click(getByText('Save'));
    expect(mockSaveFn).toHaveBeenCalledWith({
      reachOut: '',
      researchInterests: 'interests 1',
      responsibilities: 'responsibilities',
    });

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
  });

  it('disables the form elements while submitting', async () => {
    render(
      <StaticRouter>
        <RoleModal
          {...props}
          researchInterests="researchInterests"
          responsibilities="responsibilities"
          onSave={() => Promise.resolve()}
        />
      </StaticRouter>,
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    const form = saveButton.closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    [...form.elements].forEach((element) => expect(element).toBeDisabled());

    await waitFor(() => expect(saveButton).toBeEnabled());
  });

  it('shows validation message for invalid research interests', async () => {
    const { getByLabelText, findByText } = render(
      <StaticRouter>
        <RoleModal {...props} researchInterests="" />
      </StaticRouter>,
    );
    fireEvent.focusOut(getByLabelText(/main.+interests/i));

    expect(
      await findByText('Please add your research interests.'),
    ).toBeVisible();
  });

  it('shows validation message for invalid responsibilities', async () => {
    const { getByLabelText, findByText } = render(
      <StaticRouter>
        <RoleModal {...props} responsibilities="abc" researchInterests="123" />
      </StaticRouter>,
    );
    fireEvent.change(getByLabelText(/responsibilities/i), {
      target: { value: '' },
    });
    fireEvent.focusOut(getByLabelText(/responsibilities/i));
    expect(await findByText('Please add your responsibilities.')).toBeVisible();
  });
});

describe('Staff Role', () => {
  it('triggers the save function', async () => {
    const mockSaveFn = jest.fn();
    const { getByText, getByLabelText } = render(
      <StaticRouter>
        <RoleModal
          {...props}
          role="Staff"
          researchInterests={undefined}
          reachOut={'1'}
          responsibilities={'e'}
          onSave={mockSaveFn}
        />
      </StaticRouter>,
    );

    userEvent.type(getByLabelText(/responsibilities/i), 'xample');
    userEvent.type(getByLabelText(/reach out/i), '23');
    userEvent.click(getByText('Save'));

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
    expect(mockSaveFn).toHaveBeenCalledWith({
      researchInterests: '',
      responsibilities: 'example',
      reachOut: '123',
    });
  });

  it('disables the form elements while submitting', async () => {
    const { getByText } = render(
      <StaticRouter>
        <RoleModal
          {...props}
          role="Staff"
          responsibilities="responsibilities"
          reachOut="reachOut"
          onSave={() => Promise.resolve()}
        />
      </StaticRouter>,
    );

    userEvent.click(getByText(/save/i));

    const form = getByText(/save/i).closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    [...form.elements].forEach((element) => expect(element).toBeDisabled());

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
  });
});
