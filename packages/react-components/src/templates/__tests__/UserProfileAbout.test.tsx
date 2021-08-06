import { render } from '@testing-library/react';

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
