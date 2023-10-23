import { gp2 } from '@asap-hub/fixtures';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import OutputCohortsCard from '../OutputCohortsCard';

it('renders the cohorts card with no cohorts message', () => {
  render(<OutputCohortsCard contributingCohorts={[]} />);
  expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(
    /Contributing Cohort studies/i,
  );
  expect(screen.getByText(/No contributing cohorts/i)).toBeInTheDocument();
});

it('truncates the contributing cohorts card', () => {
  const { rerender } = render(
    <OutputCohortsCard contributingCohorts={gp2.contributingCohortResponse} />,
  );
  expect(screen.getAllByText(/visit study/i)).toHaveLength(1);
  expect(screen.getAllByText(/no link available/i)).toHaveLength(1);
  expect(screen.getByText('AGPDS')).toBeVisible();
  rerender(
    <OutputCohortsCard
      contributingCohorts={[
        ...gp2.contributingCohortResponse,
        { id: '4', name: 'Test' },
        { id: '3', name: 'one more' },
      ]}
    />,
  );
  expect(screen.queryByText(/one more/i)).not.toBeInTheDocument();
});
