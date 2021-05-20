import { render } from '@testing-library/react';
import { createGroupResponse } from '@asap-hub/fixtures';

import About from '../About';

it('assigns given id to the teams section for deep linking', () => {
  const { container } = render(
    <About groupTeamsElementId="group-teams" group={createGroupResponse()} />,
  );
  expect(container.querySelector('#group-teams')).toHaveTextContent(/teams/i);
});
