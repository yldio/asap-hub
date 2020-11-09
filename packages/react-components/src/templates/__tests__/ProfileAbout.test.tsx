import React from 'react';
import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';

import ProfileAbout from '../ProfileAbout';

it('renders the biography', () => {
  const { getByText } = render(
    <ProfileAbout biography="Text content" orcidWorks={[]} />,
  );
  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});
it('does not render an empty biography', () => {
  const { queryByText } = render(<ProfileAbout orcidWorks={[]} />);
  expect(queryByText(/biography/i)).not.toBeInTheDocument();
});

it('renders the recent works from ORCID', () => {
  const { getByText } = render(
    <ProfileAbout
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
  const { queryByText } = render(<ProfileAbout orcidWorks={[]} />);
  expect(queryByText(/recent/i)).not.toBeInTheDocument();
});

it('does not render an edit button by default', () => {
  const { queryByLabelText } = render(<ProfileAbout orcidWorks={[]} />);
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});
it('renders an edit button for the biography', () => {
  const { getByLabelText } = render(
    <ProfileAbout orcidWorks={[]} editBiographyHref="/edit-biography" />,
  );
  expect(getByLabelText(/edit.+bio/i)).toHaveAttribute(
    'href',
    '/edit-biography',
  );
});
it('disables the edit button for the biography (REGRESSION)', () => {
  disable('PROFILE_EDITING');
  const { getByLabelText } = render(
    <ProfileAbout orcidWorks={[]} editBiographyHref="/edit-biography" />,
  );
  expect(getByLabelText(/edit.+bio/i)).not.toHaveAttribute('href');
});
it('renders an edit button for the recent works visibility', () => {
  const { getByLabelText } = render(
    <ProfileAbout orcidWorks={[]} editOrcidWorksHref="/edit-works" />,
  );
  expect(getByLabelText(/edit.+recent.+visib/i)).toHaveAttribute(
    'href',
    '/edit-works',
  );
});
it('disables the edit button for the recent works visibility (REGRESSION)', () => {
  disable('PROFILE_EDITING');
  const { getByLabelText } = render(
    <ProfileAbout orcidWorks={[]} editOrcidWorksHref="/edit-works" />,
  );
  expect(getByLabelText(/edit.+recent.+visib/i)).not.toHaveAttribute('href');
});
