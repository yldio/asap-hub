import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { render, screen } from '@testing-library/react';
import colors from '../../templates/colors';
import ProjectStatus from '../ProjectStatus';

describe('ProjectStatus', () => {
  it.each`
    status                  | color
    ${'Active' as const}    | ${colors.info900.rgb}
    ${'Completed' as const} | ${colors.secondary900.rgb}
    ${'Inactive' as const}  | ${colors.warning900.rgb}
  `("has the color '$color' for the status $status", ({ status, color }) => {
    render(<ProjectStatus status={status} />);
    const pill = findParentWithStyle(screen.getByText(status), 'color');
    expect(pill?.color).toBe(color);
  });
});
