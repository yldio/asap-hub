import { render } from '@testing-library/react';

import UserProfileLabText from '../UserProfileLabText';

it('renders a string that represents the list of labs', () => {
  const { queryByText } = render(
    <UserProfileLabText
      labs={[
        { id: 'cd7be4904', name: 'Manchester' },
        { id: 'cd7be4905', name: 'Glasgow' },
      ]}
    />,
  );
  expect(queryByText('Manchester Lab and Glasgow Lab')).toBeVisible();
});
