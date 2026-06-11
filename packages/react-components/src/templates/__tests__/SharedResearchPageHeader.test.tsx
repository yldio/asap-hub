import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createAuthUser } from '@asap-hub/fixtures';
import { useCurrentUserCRN } from '@asap-hub/react-context';

import SharedResearchPageHeader from '../SharedResearchPageHeader';

const mockIsEnabled = jest.fn();
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
  useCurrentUserCRN: jest.fn(),
}));

beforeEach(() => {
  mockIsEnabled.mockReturnValue(false);
  (useCurrentUserCRN as jest.Mock).mockReturnValue(createAuthUser());
});
afterAll(() => {
  mockIsEnabled.mockClear();
});
const props: ComponentProps<typeof SharedResearchPageHeader> = {
  searchQuery: '',
  filters: new Set(),
};
it('renders the header', () => {
  const { getByRole } = render(<SharedResearchPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <SharedResearchPageHeader {...props} searchQuery={'test123'} />,
  );
  expect(getByRole('searchbox')).toHaveValue('test123');
});

it('renders share an output button if flag PROJECT_OUTPUTS is not enabled', () => {
  mockIsEnabled.mockReturnValue(false);

  const { getByRole } = render(<SharedResearchPageHeader {...props} />);
  expect(getByRole('button', { name: /Share an output/ })).toBeInTheDocument();
});

it('does not render share an output button if flag PROJECT_OUTPUTS is enabled', () => {
  mockIsEnabled.mockImplementation(
    (flag: string) => flag === 'PROJECT_OUTPUTS',
  );

  const { queryByRole } = render(<SharedResearchPageHeader {...props} />);
  expect(
    queryByRole('button', { name: /Share an output/ }),
  ).not.toBeInTheDocument();
});
