import { render, screen } from '@testing-library/react';

import RecentSharedResearchSection from '../RecentSharedResearchSection';
import { useResearchOutputs } from '../../../shared-research/state';

jest.mock('../../../shared-research/state');

const mockUseResearchOutputs = useResearchOutputs as jest.MockedFunction<
  typeof useResearchOutputs
>;

afterEach(() => {
  jest.clearAllMocks();
});

it('shows a View All link when there are more than 5 outputs', () => {
  mockUseResearchOutputs.mockReturnValue({ items: [], total: 6 } as ReturnType<
    typeof useResearchOutputs
  >);
  render(<RecentSharedResearchSection />);

  const link = screen
    .getByTestId('view-recent-shared-outputs')
    .querySelector('a');
  expect(link).toHaveAttribute('href', '/shared-research');
});

it('hides the View All link when there are 5 or fewer outputs', () => {
  mockUseResearchOutputs.mockReturnValue({ items: [], total: 5 } as ReturnType<
    typeof useResearchOutputs
  >);
  render(<RecentSharedResearchSection />);

  expect(
    screen.queryByTestId('view-recent-shared-outputs'),
  ).not.toBeInTheDocument();
});
