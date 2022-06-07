import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import { UserProfileContext } from '@asap-hub/react-context';

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

it('shows placeholder text for degree on own profile when omitted', () => {
  const { queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/degree/i)).toBeNull();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/degree/i)).toBeVisible();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree="BA" />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/, BA/i)).toBeVisible();
});

it('shows lab information if the user is in a lab', async () => {
  const { container, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} labs={[]} />,
    </UserProfileContext.Provider>,
  );
  expect(container).not.toHaveTextContent('Lab');

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader
        {...boilerplateProps}
        labs={[
          { name: 'Brighton', id: '1' },
          { name: 'Liverpool', id: '2' },
        ]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(container).toHaveTextContent('Brighton Lab and Liverpool Lab');
});

it('displays number of shared research', async () => {
  render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} sharedOutputsCount={5} />,
    </UserProfileContext.Provider>,
  );
  expect(screen.getByText('Shared Outputs (5)')).toBeInTheDocument();
});
