import { render, screen } from '@testing-library/react';
import TeamCreateOutputHeader from '../TeamCreateOutputHeader';

describe('TeamCreateOutputHeader', () => {
  test('renders the research output type in the header', () => {
    render(<TeamCreateOutputHeader type="Bioinformatics" />);
    expect(screen.getByText('Share bioinformatics')).toBeInTheDocument();
  });

  test('renders the research output type in the description', () => {
    render(<TeamCreateOutputHeader type="Bioinformatics" />);
    expect(screen.getByText(/Add your bioinformatics/)).toBeInTheDocument();
  });
});
