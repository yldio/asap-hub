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

it('renders the article research output', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Article' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share an article/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/published article/)).toBeInTheDocument();
});

it('renders the protocol research output', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Protocol' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a protocol/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Add your protocol/)).toBeInTheDocument();
});

it('renders the dataset research output', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Dataset' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a dataset/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Add your dataset/)).toBeInTheDocument();
});

it('renders the bioinformatics research output', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Bioinformatics' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share bioinformatics/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Add bioinformatics/)).toBeInTheDocument();
});
it('renders the lab resource research output', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Lab Resource' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a lab resource/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Add your lab resource/)).toBeInTheDocument();
});

it('falls back to a generic description otherwise', () => {
  render(
    <TeamCreateOutputHeader
      researchOutput={createResearchOutput({ type: 'Presentation' })}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});
