import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<PersonalInfoModal {...props} />, {
    wrapper: StaticRouter,
  });
  expect(getByText('Your details', { selector: 'h3' })).toBeVisible();
});

it('renders default values into text inputs', () => {
  const { queryAllByRole } = render(
    <PersonalInfoModal
      {...props}
      firstName="firstName"
      lastName="lastName"
      location="location"
      jobTitle="jobTitle"
      institution="institution"
    />,
    { wrapper: StaticRouter },
  );
  expect(queryAllByRole('textbox').map((input) => input.getAttribute('value')))
    .toMatchInlineSnapshot(`
    Array [
      "firstName",
      "lastName",
      "",
      "institution",
      "jobTitle",
      "location",
    ]
  `);
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <PersonalInfoModal
      {...props}
      firstName="firstName"
      lastName="lastName"
      location="location"
      jobTitle="jobTitle"
      institution="institution"
      degree="MPH"
      onSave={jestFn}
    />,
    { wrapper: MemoryRouter },
  );

  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalledWith({
    firstName: 'firstName',
    lastName: 'lastName',
    location: 'location',
    degree: 'MPH',
    jobTitle: 'jobTitle',
    institution: 'institution',
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
    <PersonalInfoModal {...props} onSave={handleSave} />,
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
