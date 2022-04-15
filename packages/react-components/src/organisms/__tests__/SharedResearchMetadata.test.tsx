import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchMetadata from '../SharedResearchMetadata';

const props: ComponentProps<typeof SharedResearchMetadata> = {
  documentType: 'Article',
  type: 'Code',
};

it('renders all (document)types', () => {
  const { getAllByRole } = render(
    <SharedResearchMetadata {...props} documentType="Article" type={'Code'} />,
  );
  expect(getAllByRole('listitem')).toHaveLength(2);
  const [first, second] = getAllByRole('listitem');
  expect(first).toHaveTextContent(/article/i);
  expect(second).toHaveTextContent(/code/i);
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
