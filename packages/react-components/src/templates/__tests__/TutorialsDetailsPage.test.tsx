import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TutorialsDetailsPage from '../TutorialDetailsPage';

const props: ComponentProps<typeof TutorialsDetailsPage> = {
  created: '2020-09-24T11:06:27.164Z',
  title: 'Title',
  text: 'Body',
  tags: [],
  relatedEvents: [],
  relatedTutorials: [],
  authors: [],
  teams: [],
};

it('renders the header', () => {
  const { getByRole } = render(<TutorialsDetailsPage {...props} />);
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/title/i);
});
