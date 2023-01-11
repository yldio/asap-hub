import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchMetadata from '../SharedResearchMetadata';

const props: ComponentProps<typeof SharedResearchMetadata> = {
  documentType: 'Article',
  type: 'Code',
  publishingEntity: 'Team',
};

it('renders Team document types', () => {
  const { getAllByRole } = render(
    <SharedResearchMetadata
      {...props}
      publishingEntity="Team"
      documentType="Article"
      type="Code"
    />,
  );

  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Article', 'Code']);
});

it('renders Working Group document types', () => {
  const { getAllByRole } = render(
    <SharedResearchMetadata
      {...props}
      publishingEntity="Working Group"
      documentType="Article"
      type="Code"
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Working Group', 'Article', 'Code']);
});

it('renders a link if available', () => {
  const { getByRole } = render(
    <SharedResearchMetadata {...props} link="https://example.com" />,
  );

  expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
});

it('renders a labeled link if available', () => {
  const { getByRole, getByText } = render(
    <SharedResearchMetadata {...props} link="https://example.com" />,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
  expect(getByText('Open External Link')).toBeInTheDocument();
});
