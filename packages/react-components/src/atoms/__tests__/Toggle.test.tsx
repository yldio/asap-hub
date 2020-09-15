import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from '../Toggle';
import { profileIcon, teamIcon } from '../../icons';

it('renders a toggle', () => {
  const { getByText } = render(
    <Toggle
      leftButtonIcon={teamIcon}
      leftButtonText="Left Text"
      rightButtonIcon={profileIcon}
      rightButtonText="Right Text"
      onChange={() => undefined}
    />,
  );
  expect(getByText('Left Text')).toBeVisible();
  expect(getByText('Right Text')).toBeVisible();
});

it('toggle fires onChange', async () => {
  const stub = jest.fn();
  const { getByText } = render(
    <Toggle
      leftButtonIcon={teamIcon}
      leftButtonText="Left Text"
      rightButtonIcon={profileIcon}
      rightButtonText="Right Text"
      onChange={stub}
    />,
  );
  expect(stub.mock.calls.length).toBe(0);
  await userEvent.click(getByText('Right Text'));
  expect(stub.mock.calls.length).toBe(1);
});
