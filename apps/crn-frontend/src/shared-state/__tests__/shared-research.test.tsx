import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchThemes } from '../../shared-research/api';
import { useResearchThemes } from '../shared-research';

jest.mock('../../shared-research/api', () => ({
  ...jest.requireActual('../../shared-research/api'),
  getResearchThemes: jest.fn(),
}));

const mockGetResearchThemes = getResearchThemes as jest.MockedFunction<
  typeof getResearchThemes
>;

const wrapper = ({ children }: { children: ReactNode }) => (
  <RecoilRoot>
    <Suspense fallback={null}>
      <Auth0Provider user={{}}>
        <WhenReady>{children}</WhenReady>
      </Auth0Provider>
    </Suspense>
  </RecoilRoot>
);

describe('useResearchThemes', () => {
  beforeEach(() => {
    mockGetResearchThemes.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls getResearchThemes with no types when invoked without arguments', async () => {
    renderHook(() => useResearchThemes(), { wrapper });

    await waitFor(() =>
      expect(mockGetResearchThemes).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
      ),
    );
  });

  it('forwards the types filter when provided', async () => {
    renderHook(() => useResearchThemes(['Resource']), { wrapper });

    await waitFor(() =>
      expect(mockGetResearchThemes).toHaveBeenCalledWith(expect.any(String), [
        'Resource',
      ]),
    );
  });
});
