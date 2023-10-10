import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TutorialsPage from '../TutorialsPage';

const props: ComponentProps<typeof TutorialsPage> = {
  searchQuery: '',
  onSearchQueryChange: jest.fn(),
};

it('renders the header', () => {
  const { getByRole } = render(
    <TutorialsPage {...props}>Content</TutorialsPage>,
  );
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <TutorialsPage {...props}>Content</TutorialsPage>,
  );
  expect(getByText('Content')).toBeVisible();
});
