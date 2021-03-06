import { ComponentProps } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import TeamMembershipModal from '../TeamMembershipModal';

const props: ComponentProps<typeof TeamMembershipModal> = {
  ...createUserResponse().teams[0],
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<TeamMembershipModal {...props} />, {
    wrapper: StaticRouter,
  });
  expect(
    getByText('Your Role in ASAP Network', { selector: 'h3' }),
  ).toBeVisible();
});

it('renders default values into text inputs', () => {
  const { getByLabelText, getByText } = render(
    <TeamMembershipModal
      {...props}
      approach="approach"
      responsibilities="responsibilities"
      role="Collaborating PI"
      displayName="Team Name"
    />,
    { wrapper: StaticRouter },
  );
  expect(getByLabelText(/team/i)).toHaveValue('Team Name');
  expect(getByText('Collaborating PI')).toBeVisible();
  expect(getByLabelText(/main.+interests/i)).toHaveValue('approach');
  expect(getByLabelText(/responsibilities/i)).toHaveValue('responsibilities');
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText, getByDisplayValue } = render(
    <TeamMembershipModal
      {...props}
      id="id"
      approach="approach"
      responsibilities="responsibilities"
      role="Collaborating PI"
      displayName="Team Name"
      onSave={jestFn}
    />,
    { wrapper: MemoryRouter },
  );

  userEvent.type(getByDisplayValue('approach'), ' 1');
  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalledWith({
    teams: [
      {
        id: 'id',
        approach: 'approach 1',
        responsibilities: 'responsibilities',
      },
    ],
  });

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <TeamMembershipModal
      {...props}
      approach="approach"
      responsibilities="responsibilities"
      onSave={handleSave}
    />,
    { wrapper: StaticRouter },
  );

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('shows validation message for inexistent Main research interests', async () => {
  const { getByLabelText, findByText } = render(
    <TeamMembershipModal
      {...props}
      approach="approach"
      responsibilities="responsibilities"
    />,
    { wrapper: StaticRouter },
  );
  const textArea = getByLabelText(/main.+interests/i);

  fireEvent.change(textArea, {
    target: { value: '' },
  });
  fireEvent.focusOut(textArea);

  expect(await findByText('Please add your research interests.')).toBeVisible();
});

it('shows validation message for inexistent Your responsibilities', async () => {
  const { getByLabelText, findByText } = render(
    <TeamMembershipModal
      {...props}
      approach="approach"
      responsibilities="responsibilities"
    />,
    { wrapper: StaticRouter },
  );
  const textArea = getByLabelText(/responsibilities/i);

  fireEvent.change(textArea, {
    target: { value: '' },
  });
  fireEvent.focusOut(textArea);

  expect(await findByText('Please add your responsibilities.')).toBeVisible();
});
