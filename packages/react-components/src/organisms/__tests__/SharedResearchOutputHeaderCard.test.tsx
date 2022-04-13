import { render } from '@testing-library/react';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import SharedResearchOutputHeaderCard from '../SharedResearchOutputHeaderCard';

it('renders an output with an external link if available', () => {
  const { queryByTitle, getByTitle, getByText, rerender } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      link={undefined}
    />,
  );
  expect(queryByTitle(/external link/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      link="http://example.com"
    />,
  );
  expect(getByTitle(/external link/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
  expect(getByText('Open External Link')).toBeInTheDocument();
});

it('renders an output with a last updated date', () => {
  const { getByText } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      lastUpdatedPartial={new Date(2003, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2003/)).toBeVisible();
});

it('falls back to created date when added date omitted', () => {
  const { getByText, rerender } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      created={new Date(2011, 1, 1, 1).toISOString()}
      addedDate={new Date(2012, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2012/)).toBeVisible();
  rerender(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      created={new Date(2011, 1, 1, 1).toISOString()}
      addedDate={new Date(2011, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2011/)).toBeVisible();
});

it('shows authors', () => {
  const { getByText } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      authors={[{ ...createUserResponse(), displayName: 'John Doe' }]}
    />,
  );
  expect(getByText('John Doe')).toBeVisible();
});

it('shows labs', () => {
  const { getByText } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      labs={[{ id: 'a', name: 'Example' }]}
    />,
  );
  expect(getByText(/example lab/i)).toBeVisible();
});

it('renders an output with type and subtypes', () => {
  const { getAllByRole, rerender } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      teams={[]}
      authors={[]}
      documentType="Protocol"
      type={undefined}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Protocol']);

  rerender(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      teams={[]}
      authors={[]}
      documentType="Protocol"
      type={'3D Printing'}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Protocol', '3D Printing']);
});
