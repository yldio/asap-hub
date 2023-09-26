import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import {
  createTutorialsResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import TutorialHeaderCard from '../TutorialHeaderCard';

const tutorialHeaderCardProps: ComponentProps<typeof TutorialHeaderCard> = {
  authors: [],
  title: 'Tutorial 1',
  teams: [],
  created: new Date(2011, 1, 1, 1).toISOString(),
};

it('renders last updated date if provided', () => {
  const { getByText } = render(
    <TutorialHeaderCard
      {...tutorialHeaderCardProps}
      lastUpdated={new Date(2003, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2003/)).toBeVisible();
});

it('shows authors', () => {
  const { getByText } = render(
    <TutorialHeaderCard
      {...createTutorialsResponse({ key: 'Test Tutorial' })}
      authors={[{ ...createUserResponse(), displayName: 'John Doe' }]}
    />,
  );
  expect(getByText('John Doe')).toBeVisible();
});
