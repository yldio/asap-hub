import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';
import { createListUserResponse } from '@asap-hub/fixtures';

import ProfileHeader from '../ProfileHeader';

const boilerplateProps: ComponentProps<typeof ProfileHeader> = {
  ...createListUserResponse(1).items[0], // TODO
  teams: [],
  aboutHref: './about',
  researchHref: './research',
  outputsHref: './outputs',
  role: 'Grantee',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <ProfileHeader {...boilerplateProps} displayName="John Doe" />,
  );
  expect(getByRole('heading')).toHaveTextContent('John Doe');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('generates the last updated text', () => {
  const { container } = render(
    <ProfileHeader
      {...boilerplateProps}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});

it('generates the mailto link', () => {
  const { getByText } = render(
    <ProfileHeader {...boilerplateProps} email="test@test.com" />,
  );
  expect(getByText(/contact/i).parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});

describe('an edit button', () => {
  it('is not rendered by default', () => {
    const { queryByLabelText } = render(
      <ProfileHeader {...boilerplateProps} />,
    );
    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info', () => {
    const { getByLabelText } = render(
      <ProfileHeader
        {...boilerplateProps}
        editPersonalInfoHref="/edit-personal-info"
      />,
    );
    expect(getByLabelText(/edit.+personal/i)).toBeVisible();
  });

  it('is rendered for contact info', () => {
    const { getByLabelText } = render(
      <ProfileHeader
        {...boilerplateProps}
        editContactHref="/edit-contact-info"
      />,
    );
    expect(getByLabelText(/edit.+contact/i)).toBeVisible();
  });
});

it('generates staff profile without contact and tabs', () => {
  const { queryByText } = render(
    <ProfileHeader {...boilerplateProps} email="test@test.com" role="Staff" />,
  );

  expect(queryByText(/contact/i)).not.toBeInTheDocument();
  expect(queryByText(/research/i)).not.toBeInTheDocument();
  expect(queryByText(/background/i)).not.toBeInTheDocument();
  expect(queryByText(/outputs/i)).not.toBeInTheDocument();
});
