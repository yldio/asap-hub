import { render } from '@testing-library/react';

import WorkingGroupsTabbedCard from '../WorkingGroupsTabbedCard';

it('displays the title', () => {
  const { getByText } = render(
    <WorkingGroupsTabbedCard
      userName="Brad B"
      groups={[]}
      isUserAlumni={false}
    />,
  );

  expect(getByText("Brad B's Working Groups")).toBeInTheDocument();
});
