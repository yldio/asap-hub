import { gp2 } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import OutputCard from '../OutputCard';

describe('OutputCard', () => {
  const defaultProps = gp2.createOutputResponse();

  it('renders title', () => {
    render(<OutputCard {...defaultProps} title="Output Title" />);
    expect(screen.getByRole('heading', { name: 'Output Title' })).toBeVisible();
  });

  it('renders link to project', () => {
    render(
      <OutputCard
        {...defaultProps}
        projects={{ id: '42', title: 'project name' }}
      />,
    );
    expect(screen.getByRole('link', { name: /project name/i })).toHaveAttribute(
      'href',
      expect.stringContaining('42'),
    );
  });
  it('renders link to workingGroup', () => {
    render(
      <OutputCard
        {...defaultProps}
        workingGroups={{ id: '42', title: 'working group name' }}
      />,
    );
    expect(
      screen.getByRole('link', { name: /working group name/i }),
    ).toHaveAttribute('href', expect.stringContaining('42'));
  });
});
