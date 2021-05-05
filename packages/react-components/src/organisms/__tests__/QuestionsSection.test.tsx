import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import QuestionsSection from '../QuestionsSection';

const props: ComponentProps<typeof QuestionsSection> = {
  firstName: '',
  questions: [''],
};
it('renders open questions', () => {
  const { getByText, getByRole } = render(
    <QuestionsSection
      {...props}
      firstName="bob"
      questions={['What is the meaning of life']}
    />,
  );
  expect(getByRole('heading', { level: 2 }).textContent).toMatchInlineSnapshot(
    `"bob's Open Questions"`,
  );
  expect(getByText(/meaning of life/i)).toBeVisible();
});

it('handles empty names', () => {
  const { getByRole } = render(<QuestionsSection {...props} firstName="" />);
  expect(getByRole('heading', { level: 2 }).textContent).toMatchInlineSnapshot(
    `"Open Questions"`,
  );
});

it('renders placeholder when no open questions supplied and ownProfile is true', () => {
  const { getByRole } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <QuestionsSection {...props} questions={[]} />
    </UserProfileContext.Provider>,
  );
  expect(getByRole('heading', { level: 4 }).textContent).toMatch(
    /burning research/i,
  );
});

it('does not render when no open questions and ownProfile is false', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <QuestionsSection {...props} questions={[]} />
    </UserProfileContext.Provider>,
  );
  expect(container).toBeEmptyDOMElement();
});
