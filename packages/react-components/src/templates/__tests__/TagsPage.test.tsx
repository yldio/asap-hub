import { CRNTagSearchEntities } from '@asap-hub/algolia';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import TagsPage from '../TagsPage';

const props: ComponentProps<typeof TagsPage> = {
  filterOptions: [],
  onChangeFilter: jest.fn(),
  tags: [],
  setTags: jest.fn(),
  loadTags: jest.fn(),
  filters: new Set<CRNTagSearchEntities>(),
};

it('renders the tags page header and children', () => {
  render(<TagsPage {...props}>Test</TagsPage>);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/tags/i);
  expect(screen.getByText('Test')).toBeVisible();
});
