import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';

import UserProfileAbout from '../UserProfileAbout';

it('renders the biography', () => {
  const { getByText } = render(
    <UserProfileAbout biography="Text content" orcidWorks={[]} />,
  );
  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});

it('renders the recent works from ORCID', () => {
  const { getByText } = render(
    <UserProfileAbout
      orcidWorks={[
        {
          type: 'BOOK',
          title: 'Clean Code',
          publicationDate: { year: '2008' },
          lastModifiedDate: 'unknown',
        },
      ]}
    />,
  );
  expect(getByText(/recent/i)).toBeVisible();
  expect(getByText('Clean Code')).toBeVisible();
});
it('does not render an empty recent works list', () => {
  const { queryByText } = render(<UserProfileAbout orcidWorks={[]} />);
  expect(queryByText(/recent/i)).not.toBeInTheDocument();
});

it('does not render an edit button by default', () => {
  const { queryByLabelText } = render(<UserProfileAbout orcidWorks={[]} />);
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});
it('renders an edit button for the biography', () => {
  const { getByLabelText } = render(
    <UserProfileAbout orcidWorks={[]} editBiographyHref="/edit-biography" />,
  );
  expect(getByLabelText(/edit.+bio/i)).toHaveAttribute(
    'href',
    '/edit-biography',
  );
});
it('renders an edit button for the recent works visibility', () => {
  const { getByLabelText } = render(
    <UserProfileAbout orcidWorks={[]} editOrcidWorksHref="/edit-works" />,
  );
  expect(getByLabelText(/edit.+recent.+visib/i)).toHaveAttribute(
    'href',
    '/edit-works',
  );
});
it('disables the edit button for the recent works visibility (REGRESSION)', () => {
  disable('USER_PROFILE_EDIT_WORKS');
  const { getByLabelText } = render(
    <UserProfileAbout orcidWorks={[]} editOrcidWorksHref="/edit-works" />,
  );
  expect(getByLabelText(/edit.+recent.+visib/i)).not.toHaveAttribute('href');
});
