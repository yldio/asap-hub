import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ManuscriptVersionImportCard from '../ManuscriptVersionImportCard';

const props: ComponentProps<typeof ManuscriptVersionImportCard> = {
  version: {
    id: 'mv-manuscript-id-1',
    hasLinkedResearchOutput: false,
    title: 'Manuscript 1',
    url: 'http://example.com',
    type: 'Original Research',
    lifecycle: 'Publication',
    manuscriptId: 'WH1-000282-001-org-P-2',
    teamId: 'team-id-1',
  },
};

it('renders card', () => {
  const { getByRole } = render(<ManuscriptVersionImportCard {...props} />);

  expect(
    getByRole('heading', { name: /Imported Manuscript Version/i }),
  ).toBeVisible();
});

it('renders version data', () => {
  const { getByText } = render(<ManuscriptVersionImportCard {...props} />);

  expect(getByText(/Original Research/i)).toBeVisible();
  expect(getByText(/Publication/i)).toBeVisible();
  expect(getByText(/WH1-000282-001-org-P-2/i)).toBeVisible();
});
