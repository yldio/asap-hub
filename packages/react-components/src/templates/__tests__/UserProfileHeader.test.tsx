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
  render(<UserProfileHeader {...boilerplateProps} email="me@example.com" />);
  expect(screen.getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:me@example.com',
  );
});
it('prefers an explicit contact email address', () => {
  render(
    <UserProfileHeader
      {...boilerplateProps}
      contactEmail="contact@example.com"
    />,
  );
  expect(screen.getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:contact@example.com',
  );
});

describe('an edit button', () => {
  it('is not rendered by default', () => {
    render(<UserProfileHeader {...boilerplateProps} />);
    expect(screen.queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info', () => {
    render(
      <UserProfileHeader
        {...boilerplateProps}
        editPersonalInfoHref="/edit-personal-info"
      />,
    );
    expect(screen.getByLabelText(/edit.+personal/i)).toHaveAttribute(
      'href',
      '/edit-personal-info',
    );
  });

  it('is rendered for contact info', () => {
    render(
      <UserProfileHeader
        {...boilerplateProps}
        editContactInfoHref="/edit-contact-info"
      />,
    );
    expect(screen.getByLabelText(/edit.+contact/i)).toHaveAttribute(
      'href',
      '/edit-contact-info',
    );
  });
});

it('is rendered for avatar', () => {
  render(
    <UserProfileHeader
      {...boilerplateProps}
      onImageSelect={(file: File) => {}}
    />,
  );
  expect(screen.getByLabelText(/edit.+avatar/i)).toBeVisible();
  expect(screen.getByLabelText(/upload.+avatar/i)).not.toHaveAttribute(
    'disabled',
  );
});

it('shows placeholder text for degree on own profile when omitted', () => {
  const { rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(screen.queryByText(/degree/i)).toBeNull();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(screen.queryByText(/degree/i)).toBeVisible();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree="BA" />,
    </UserProfileContext.Provider>,
  );
  expect(screen.queryByText(/, BA/i)).toBeVisible();
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

it('shows number of research outputs', () => {
  render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} researchOutputsCount={20} />,
    </UserProfileContext.Provider>,
  );

  expect(screen.getByText('Shared Outputs (20)')).toBeInTheDocument();
});
