import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { render, screen } from '@testing-library/react';
import colors from '../../templates/colors';
import StatusPill from '../StatusPill';

describe('StatusPill', () => {
  it.each`
    status                  | color
    ${'Active' as const}    | ${colors.info500.rgb}
    ${'Completed' as const} | ${colors.success500.rgb}
    ${'Paused' as const}    | ${colors.warning500.rgb}
  `("has the color '$color' for the status $status", ({ status, color }) => {
    render(<StatusPill status={status} />);
    const pill = findParentWithStyle(screen.getByText(status), 'color');
    expect(pill?.color).toBe(color);
  });
});
