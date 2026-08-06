import { createManuscriptVersionResponse } from '@asap-hub/fixtures';
import { InnerToastContext } from '@asap-hub/react-context';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { decideManuscriptImport } from '../manuscript-import';
import ManuscriptOutputSelectionScreen from '../ManuscriptOutputSelectionScreen';

const mockManuscriptVersion = createManuscriptVersionResponse();
let importError: unknown;

jest.mock('../../network/teams/state', () => ({
  useManuscriptVersionSuggestions: () => jest.fn().mockResolvedValue([]),
  usePostPreprintResearchOutput: () => jest.fn(),
}));

jest.mock('../manuscript-import', () => ({
  ...jest.requireActual('../manuscript-import'),
  decideManuscriptImport: jest.fn(),
}));

jest.mock('@asap-hub/react-components', () => ({
  ManuscriptOutputSelection: ({
    onImportManuscript,
    setSelectedVersion,
  }: {
    onImportManuscript: () => void | Promise<void>;
    setSelectedVersion: (option: {
      version: typeof mockManuscriptVersion;
      label: string;
      value: string;
    }) => void;
  }) => (
    <>
      <button
        type="button"
        onClick={() =>
          setSelectedVersion({
            version: mockManuscriptVersion,
            label: 'Manuscript',
            value: 'mv-1',
          })
        }
      >
        Select version
      </button>
      <button
        type="button"
        onClick={() => {
          void Promise.resolve(onImportManuscript()).catch((error) => {
            importError = error;
          });
        }}
      >
        Import
      </button>
    </>
  ),
}));

const mockDecideManuscriptImport =
  decideManuscriptImport as jest.MockedFunction<typeof decideManuscriptImport>;

beforeEach(() => {
  importError = undefined;
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderScreen = (onManuscriptImported = jest.fn()) => {
  render(
    <MemoryRouter>
      <InnerToastContext.Provider value={jest.fn()}>
        <ManuscriptOutputSelectionScreen
          teamId="team-1"
          onCreateManually={jest.fn()}
          onManuscriptImported={onManuscriptImported}
        />
      </InnerToastContext.Provider>
    </MemoryRouter>,
  );
  return onManuscriptImported;
};

it('does nothing when importing without a selected manuscript version', async () => {
  const onManuscriptImported = renderScreen();
  const user = userEvent.setup({ delay: null });

  await user.click(screen.getByRole('button', { name: /^import$/i }));

  expect(mockDecideManuscriptImport).not.toHaveBeenCalled();
  expect(onManuscriptImported).not.toHaveBeenCalled();
  expect(importError).toBeUndefined();
});

it('throws when decideManuscriptImport returns an unhandled action', async () => {
  mockDecideManuscriptImport.mockReturnValue({
    action: 'not-a-real-action',
  } as never);

  const user = userEvent.setup({ delay: null });
  renderScreen();

  await user.click(screen.getByRole('button', { name: /select version/i }));
  await user.click(screen.getByRole('button', { name: /^import$/i }));

  await waitFor(() => {
    expect(importError).toEqual(
      expect.objectContaining({
        message: expect.stringMatching(/Unhandled manuscript import decision/),
      }),
    );
  });
});
