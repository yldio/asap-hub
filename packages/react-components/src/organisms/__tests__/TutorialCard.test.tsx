import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createTutorialsResponse } from '@asap-hub/fixtures';

import TutorialCard from '../TutorialCard';

const tutorialCardProps: ComponentProps<typeof TutorialCard> =
  createTutorialsResponse({ key: 'Test Tutorial' });

it('renders the title', () => {
  const { getByRole } = render(
    <TutorialCard {...tutorialCardProps} title="test123" />,
  );
  expect(getByRole('heading').textContent).toEqual('test123');
  expect(getByRole('heading').tagName).toEqual('H4');
});

it('renders thumbnail when present', () => {
  const { rerender, getByRole, queryByRole } = render(
    <TutorialCard {...tutorialCardProps} authors={[]} teams={[]} />,
  );
  expect(queryByRole('img')).not.toBeInTheDocument();

  rerender(
    <TutorialCard
      {...tutorialCardProps}
      thumbnail="/thumbnail"
      authors={[]}
      teams={[]}
    />,
  );
  expect(getByRole('img')).toBeVisible();
});

it('displays tags when present', () => {
  const { getByText } = render(
    <TutorialCard {...tutorialCardProps} tags={['Tag 1']} />,
  );
  expect(getByText('Tag 1')).toBeVisible();
});
