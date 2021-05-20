import React from 'react';
import { render } from '@testing-library/react';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { disable } from '@asap-hub/flags';

import SharedResearchOutputHeaderCard from '../SharedResearchOutputHeaderCard';

it('renders an output with an external link if available', () => {
  const { queryByTitle, getByTitle, rerender } = render(
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
});

it('renders an output with a modified date', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      lastModifiedDate={undefined}
    />,
  );
  expect(queryByText(/2003/)).not.toBeInTheDocument();
  rerender(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      addedDate={new Date(2003, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2003/)).toBeVisible();
});

it('falls back to created date when added date omitted', () => {
  const { getByText, rerender } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={new Date(2020, 1, 1, 1).toISOString()}
      lastModifiedDate={undefined}
    />,
  );
  expect(getByText(/2020/)).toBeVisible();
  rerender(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      created={new Date(2019, 1, 1, 1).toISOString()}
      addedDate={undefined}
      lastModifiedDate={undefined}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
});

it('does not show authors (REGRESSION)', () => {
  disable('RESEARCH_OUTPUT_SHOW_AUTHORS_LIST');
  const { queryByText } = render(
    <SharedResearchOutputHeaderCard
      {...createResearchOutputResponse()}
      authors={[{ ...createUserResponse(), displayName: 'John Doe' }]}
    />,
  );
  expect(queryByText('John Doe')).not.toBeInTheDocument();
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
