import { render } from '@testing-library/react';
import { createGroupResponse } from '@asap-hub/fixtures';

import About from '../About';

// [CRN-1106] Remove skip when adding new Group Members component
// eslint-disable-next-line jest/no-disabled-tests
it.skip('assigns given id to the teams section for deep linking', () => {
  const { container } = render(
    <About groupTeamsElementId="group-teams" group={createGroupResponse()} />,
  );
  expect(container.querySelector('#group-teams')).toHaveTextContent(/teams/i);
});
