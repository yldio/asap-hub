import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';
import { createUserResponse } from '@asap-hub/fixtures';

import UserProfileHeader from '../UserProfileHeader';

const boilerplateProps: ComponentProps<typeof UserProfileHeader> = {
  ...createUserResponse(),
  role: 'Grantee',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <UserProfileHeader {...boilerplateProps} displayName="John Doe" />,
  );
  expect(getByRole('heading')).toHaveTextContent('John Doe');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('generates the last updated text', () => {
  const { container } = render(
    <UserProfileHeader
      {...boilerplateProps}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});

it('generates the mailto link', () => {
  const { getByText } = render(
    <UserProfileHeader {...boilerplateProps} email="me@example.com" />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:me@example.com',
  );
});
it('prefers an explicit contact email address', () => {
  const { getByText } = render(
    <UserProfileHeader
      {...boilerplateProps}
      contactEmail="contact@example.com"
    />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:contact@example.com',
  );
});

describe('an edit button', () => {
  it('is not rendered by default', () => {
    const { queryByLabelText } = render(
      <UserProfileHeader {...boilerplateProps} />,
    );
    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info', () => {
    const { getByLabelText } = render(
      <UserProfileHeader
        {...boilerplateProps}
        editPersonalInfoHref="/edit-personal-info"
      />,
    );
    expect(getByLabelText(/edit.+personal/i)).toHaveAttribute(
      'href',
      '/edit-personal-info',
    );
  });

  it('is rendered for contact info', () => {
    const { getByLabelText } = render(
      <UserProfileHeader
        {...boilerplateProps}
        editContactInfoHref="/edit-contact-info"
      />,
    );
    expect(getByLabelText(/edit.+contact/i)).toHaveAttribute(
      'href',
      '/edit-contact-info',
    );
  });
});

it('is rendered for avatar', () => {
  const { getByLabelText } = render(
    <UserProfileHeader
      {...boilerplateProps}
      onImageSelect={(file: File) => {}}
    />,
  );
  expect(getByLabelText(/edit.+avatar/i)).toBeVisible();
  expect(getByLabelText(/upload.+avatar/i)).not.toHaveAttribute('disabled');
});

it('generates staff profile without contact and tabs', () => {
  const { queryByText } = render(
    <UserProfileHeader
      {...boilerplateProps}
      email="test@test.com"
      role="Staff"
    />,
  );

  expect(queryByText(/contact/i)).not.toBeInTheDocument();
  expect(queryByText(/research/i)).not.toBeInTheDocument();
  expect(queryByText(/background/i)).not.toBeInTheDocument();
  expect(queryByText(/outputs/i)).not.toBeInTheDocument();
});
