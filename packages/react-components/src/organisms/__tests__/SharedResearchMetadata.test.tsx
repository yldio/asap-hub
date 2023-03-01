import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchMetadata from '../SharedResearchMetadata';

const props: ComponentProps<typeof SharedResearchMetadata> = {
  pills: ['Team', 'Article', 'Code'],
};

it('renders the pills', () => {
  const { getAllByRole } = render(<SharedResearchMetadata {...props} />);

  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Team', 'Article', 'Code']);
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
