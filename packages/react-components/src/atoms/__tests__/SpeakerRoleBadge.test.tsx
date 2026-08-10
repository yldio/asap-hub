import { render } from '@testing-library/react';

import { steel } from '../../colors';
import SpeakerRoleBadge from '../SpeakerRoleBadge';

it('renders the single role when exactly one role is given', () => {
  const { getByText } = render(<SpeakerRoleBadge roles={['Lead PI']} />);
  expect(getByText('Lead PI')).toBeVisible();
});

it('renders "Multiple roles" when two or more roles are given', () => {
  const { getByText } = render(
    <SpeakerRoleBadge roles={['Project Manager', 'Data Manager']} />,
  );
  expect(getByText('Multiple roles')).toBeVisible();
});

it('renders "No role" when no roles are given', () => {
  const { getByText } = render(<SpeakerRoleBadge roles={[]} />);
  expect(getByText('No role')).toBeVisible();
});

it('applies steel background when disabled', () => {
  const { getByText } = render(
    <SpeakerRoleBadge roles={['Lead PI']} enabled={false} />,
  );
  const pill = getByText('Lead PI').closest('[class*="Pill"]')
    ?? getByText('Lead PI').parentElement!.parentElement!;
  expect(pill).toHaveStyle({ backgroundColor: steel.rgb });
});
