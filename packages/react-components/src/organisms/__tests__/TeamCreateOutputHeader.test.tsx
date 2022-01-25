import { createResearchOutput } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import TeamCreateOutputHeader from '../TeamCreateOutputHeader';

describe('TeamCreateOutputHeader', () => {
  it('renders the research output type in the header', () => {
    render(<TeamCreateOutputHeader researchOutput={createResearchOutput()} />);
    expect(
      screen.getByRole('heading', { name: /Share bioinformatics/i }),
    ).toBeInTheDocument();
  });

  it('renders the research output type in the description', () => {
    render(<TeamCreateOutputHeader researchOutput={createResearchOutput()} />);
    expect(screen.getByText(/Add your bioinformatics/)).toBeInTheDocument();
  });
});
