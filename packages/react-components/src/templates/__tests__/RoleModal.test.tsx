import { ComponentProps } from 'react';
import { StaticRouter, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';

import RoleModal from '../RoleModal';

const props: ComponentProps<typeof RoleModal> = {
  ...createUserResponse({ teams: 4, labs: 2 }),
  researchInterests: 'mainResearchInterests',
  responsibilities: 'responsibilities',
  backHref: '/wrong',
};

describe('RoleModal', () => {
  it('renders the title', () => {
    const { getByText } = render(<RoleModal {...props} />, {
      wrapper: StaticRouter,
    });
    expect(getByText('Your Role on ASAP', { selector: 'h3' })).toBeVisible();
  });

  it('indicates which fields are required or optional', () => {
    const { getByText } = render(<RoleModal {...props} />, {
      wrapper: StaticRouter,
    });

    [
      { title: 'Main research interests', subtitle: 'Required' },
      { title: 'Your responsibilities', subtitle: 'Required' },
    ].forEach(({ title, subtitle }) =>
      expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
    );
  });

  it('renders default values into inputs', async () => {
    const { getByLabelText, getAllByLabelText } = render(
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
      />,
      { wrapper: StaticRouter },
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

  it('triggers the save function', async () => {
    const mockSaveFn = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <RoleModal {...props} onSave={mockSaveFn} />,
      { wrapper: MemoryRouter },
    );

    userEvent.type(getByDisplayValue('mainResearchInterests'), ' 1');
    userEvent.click(getByText('Save'));
    expect(mockSaveFn).toHaveBeenCalledWith({
      researchInterests: 'mainResearchInterests 1',
      responsibilities: 'responsibilities',
    });

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
  });

  it('disables the form elements while submitting', async () => {
    const { getByText } = render(
      <RoleModal {...props} onSave={() => Promise.resolve()} />,
      { wrapper: StaticRouter },
    );

    userEvent.click(getByText(/save/i));

    const form = getByText(/save/i).closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    [...form.elements].forEach((element) => expect(element).toBeDisabled());

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
  });

  it('shows validation message for inexistent Main research interests', async () => {
    const { getByLabelText, findByText } = render(<RoleModal {...props} />, {
      wrapper: StaticRouter,
    });
    const textArea = getByLabelText(/main.+interests/i);

    fireEvent.change(textArea, { target: { value: '' } });
    fireEvent.focusOut(textArea);

    expect(
      await findByText('Please add your research interests.'),
    ).toBeVisible();
  });

  it('shows validation message for inexistent responsibilities', async () => {
    const { getByLabelText, findByText } = render(<RoleModal {...props} />, {
      wrapper: StaticRouter,
    });
    const textArea = getByLabelText(/responsibilities/i);

    fireEvent.change(textArea, { target: { value: '' } });
    fireEvent.focusOut(textArea);

    expect(await findByText('Please add your responsibilities.')).toBeVisible();
  });
});
