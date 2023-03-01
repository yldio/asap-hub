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
  it('renders the link when available', () => {
    render(<OutputCard {...defaultProps} link="https://example.com" />);
    expect(
      screen.getByRole('link', { name: /access output/i }),
    ).toHaveAttribute('href', 'https://example.com');
  });
  it('renders documentType and output type as pills', () => {
    render(
      <OutputCard {...defaultProps} documentType="Articles" type="Research" />,
    );
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual(expect.arrayContaining(['Articles', 'Research']));
  });
  it('renders authors', () => {
    const author = gp2.createOutputResponse().authors[0];
    author.displayName = 'Tony Stark';
    author.id = '123';
    render(<OutputCard {...defaultProps} authors={[author]} />);
    expect(screen.getByRole('link', { name: 'Tony Stark' })).toHaveAttribute(
      'href',
      expect.stringMatching(/123/),
    );
  });
});
