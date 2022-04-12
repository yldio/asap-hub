import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchMetadata from '../SharedResearchMetadata';

const props: ComponentProps<typeof SharedResearchMetadata> = {
  documentType: 'Article',
  subTypes: [],
};

it('renders all (sub)types', () => {
  const { getAllByRole } = render(
    <SharedResearchMetadata
      {...props}
      documentType="Article"
      subTypes={['Code', 'Assay']}
    />,
  );
  expect(getAllByRole('listitem')).toHaveLength(3);
  const [first, second, third] = getAllByRole('listitem');
  expect(first).toHaveTextContent(/article/i);
  expect(second).toHaveTextContent(/code/i);
  expect(third).toHaveTextContent(/assay/i);
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
