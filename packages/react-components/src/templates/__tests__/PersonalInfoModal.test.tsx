import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import PersonalInfoModal from '../PersonalInfoModal';

const props: ComponentProps<typeof PersonalInfoModal> = {
  ...createUserResponse(),
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<PersonalInfoModal {...props} />);
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

it('triggers the save function', () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <MemoryRouter>
      <PersonalInfoModal
        {...props}
        firstName="firstName"
        lastName="lastName"
        location="location"
        jobTitle="jobTitle"
        institution="institution"
        degree="BA"
        onSave={jestFn}
      />
      ,
    </MemoryRouter>,
  );
  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalledWith({
    firstName: 'firstName',
    lastName: 'lastName',
    location: 'location',
    degree: 'BA',
    jobTitle: 'jobTitle',
    institution: 'institution',
  });
});
