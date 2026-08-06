import { fireEvent, render, screen } from '@testing-library/react';

import PendingSpeakerCard from '../PendingSpeakerCard';

const defaultProps = {
  displayName: 'Jane Doe',
  userId: 'u1',
  teams: [
    { teamId: 't1', teamName: 'Team Alpha' },
    { teamId: 't2', teamName: 'Team Beta' },
  ],
  onPickTeam: jest.fn(),
  onDismiss: jest.fn(),
};

it('renders the speaker and a pill per team', () => {
  render(<PendingSpeakerCard {...defaultProps} />);
  expect(screen.getByRole('link', { name: 'Jane Doe' })).toBeVisible();
  expect(screen.getByRole('button', { name: /Team Alpha/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /Team Beta/ })).toBeEnabled();
});

it('calls onPickTeam with the picked team id', () => {
  const onPickTeam = jest.fn();
  render(<PendingSpeakerCard {...defaultProps} onPickTeam={onPickTeam} />);
  fireEvent.click(screen.getByRole('button', { name: /Team Beta/ }));
  // PillSelector reports the whole selection, so the card forwards each id
  // through Array.forEach — assert the id rather than forEach's extra args.
  expect(onPickTeam.mock.calls[0]?.[0]).toBe('t2');
});

it('disables the team pills and the dismiss button when not enabled', () => {
  render(<PendingSpeakerCard {...defaultProps} enabled={false} />);
  expect(screen.getByRole('button', { name: /Team Alpha/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: /Team Beta/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Remove Jane Doe' })).toBeDisabled();
});
