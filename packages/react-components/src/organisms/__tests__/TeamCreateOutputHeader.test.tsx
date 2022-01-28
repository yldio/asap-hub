import { createResearchOutput } from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import TeamCreateOutputHeader from '../TeamCreateOutputHeader';

beforeEach(() => {
  const {
    result: {
      current: { disable },
    },
  } = renderHook(useFlags);

  disable('ROMS_FORM');
});
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
