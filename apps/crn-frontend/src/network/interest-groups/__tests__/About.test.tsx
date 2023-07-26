import { render } from '@testing-library/react';
import { createInterestGroupResponse } from '@asap-hub/fixtures';

import About from '../About';

it('assigns given id to the teams section for deep linking', () => {
  const { container } = render(
    <About
      interestGroupTeamsElementId="group-teams"
      interestGroup={createInterestGroupResponse()}
    />,
  );
  expect(container.querySelector('#group-teams')).toHaveTextContent(/teams/i);
});
