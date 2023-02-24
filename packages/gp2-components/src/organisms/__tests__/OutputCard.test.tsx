import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OutputCard from '../OutputCard';

describe('OutputCard', () => {
  const defaultProps = gp2.createOutputResponse();

  it('renders title', () => {
    render(<OutputCard {...defaultProps} title="Output Title" />);
    expect(screen.getByRole('heading', { name: 'Output Title' })).toBeVisible();
  });
});
