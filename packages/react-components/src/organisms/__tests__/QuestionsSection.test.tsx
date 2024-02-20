import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import QuestionsSection from '../QuestionsSection';

const props: ComponentProps<typeof QuestionsSection> = {
  questions: [''],
};
it('renders open questions', () => {
  const { getByText, getByRole } = render(
    <QuestionsSection {...props} questions={['What is the meaning of life']} />,
  );
  expect(getByRole('heading', { level: 2 }).textContent).toMatchInlineSnapshot(
    'Open Questions',
  );
  expect(getByText(/meaning of life/i)).toBeVisible();
});

it('renders placeholder when no open questions supplied for your own profile', () => {
  const { getByRole } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <QuestionsSection {...props} questions={[]} />
    </UserProfileContext.Provider>,
  );
  expect(getByRole('heading', { level: 4 }).textContent).toMatch(
    /burning research/i,
  );
});

it('does not render when no open questions for profiles other than your own', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <QuestionsSection {...props} questions={[]} />
    </UserProfileContext.Provider>,
  );
  expect(container).toBeEmptyDOMElement();
});
