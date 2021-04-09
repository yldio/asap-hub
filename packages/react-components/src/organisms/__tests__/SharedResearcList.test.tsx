import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchList from '../SharedResearchList';

const sharedResearchListProps: ComponentProps<typeof SharedResearchList> = {
  researchOutputs: [],
};
it('renders multiple research outputs', () => {
  const { getAllByRole } = render(
    <SharedResearchList
      {...sharedResearchListProps}
      researchOutputs={[
        { ...createResearchOutputResponse(0), title: 'Output 1' },
        { ...createResearchOutputResponse(1), title: 'Output 2' },
      ]}
    />,
  );
  expect(
    getAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Output 1', 'Output 2']);
});

it('links to research outputs', () => {
  const { getByRole } = render(
    <SharedResearchList
      {...sharedResearchListProps}
      researchOutputs={[
        { ...createResearchOutputResponse(0), title: 'Output 1', id: '123' },
      ]}
    />,
  );
  expect(getByRole('heading').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123/i),
  );
});

it('shows external link icon when link provided', () => {
  const { getByTitle, queryByTitle, rerender } = render(
    <SharedResearchList
      {...sharedResearchListProps}
      researchOutputs={[
        { ...createResearchOutputResponse(0), link: undefined },
      ]}
    />,
  );
  expect(queryByTitle(/external/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchList
      {...sharedResearchListProps}
      researchOutputs={[
        { ...createResearchOutputResponse(0), link: 'http://example.com' },
      ]}
    />,
  );
  expect(getByTitle(/external/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});
