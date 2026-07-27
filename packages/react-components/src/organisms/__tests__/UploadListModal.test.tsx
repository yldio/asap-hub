import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router';

import UploadListModal, { UploadListResult } from '../UploadListModal';

const uploadResult: UploadListResult = {
  matched: [
    {
      teamId: 'm1',
      teamName: 'Imaging',
      attended: true,
      teamType: 'Discovery Team',
    },
  ],
  alreadyInCount: 2,
  unmatched: [
    {
      name: 'Imagimg',
      suggestion: {
        teamId: 's1',
        teamName: 'Imaging Suggestion',
        teamType: 'Resource Team',
      },
    },
    { name: 'Data Scince' },
  ],
};

const onUploadList = jest.fn(async () => uploadResult);
const onAddAttendees = jest.fn();
const onBack = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const renderModal = (
  overrides: Partial<ComponentProps<typeof UploadListModal>> = {},
) =>
  render(
    <StaticRouter location="/">
      <UploadListModal
        onUploadList={onUploadList}
        onAddAttendees={onAddAttendees}
        onBack={onBack}
        {...overrides}
      />
    </StaticRouter>,
  );

const makeFile = (name: string, sizeInBytes = 10) => {
  const file = new File(['x'], name, { type: 'text/csv' });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
};

const upload = async (file: File, container: HTMLElement) => {
  const fileInput = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  await userEvent.upload(fileInput, file);
};

describe('UploadListModal', () => {
  it('Should render the initial step with a disabled Add Attendees button', () => {
    renderModal();

    expect(
      screen.getByRole('heading', { name: 'Upload a list' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Add teams from a list/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Attendees' }),
    ).toBeDisabled();
  });

  it('Should upload a file and show the result summary and sections', async () => {
    const { container } = renderModal();

    await upload(makeFile('teams.csv'), container);

    expect(onUploadList).toHaveBeenCalled();
    expect(await screen.findByText('teams.csv')).toBeInTheDocument();
    expect(screen.getByText('5 Teams')).toBeInTheDocument();
    expect(screen.getByText('1 matched')).toBeInTheDocument();
    expect(screen.getByText('2 already in')).toBeInTheDocument();
    expect(screen.getByText('1 teams')).toBeInTheDocument();
    expect(screen.getByText('2 not matched')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Attendees' })).toBeEnabled();
  });

  it('Should render a seeded result without any upload', async () => {
    renderModal({
      initialFiles: [makeFile('seeded.csv')],
      initialResult: uploadResult,
    });

    expect(onUploadList).not.toHaveBeenCalled();
    expect(screen.getByText('seeded.csv')).toBeInTheDocument();
    expect(screen.getByText('5 Teams')).toBeInTheDocument();
    expect(screen.getByText('2 not matched')).toBeInTheDocument();
    // Sections are collapsed by default.
    expect(
      screen.queryByRole('link', { name: 'Imaging' }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Add Attendees' }),
    );
    expect(onAddAttendees).toHaveBeenCalledWith(
      [expect.objectContaining({ teamId: 'm1', teamName: 'Imaging' })],
      [expect.objectContaining({ name: 'seeded.csv' })],
    );
  });

  it('Should render seeded sections expanded when initialSectionsOpen is set', () => {
    renderModal({
      initialFiles: [makeFile('seeded.csv')],
      initialResult: uploadResult,
      initialSectionsOpen: true,
    });

    // Both accordions are open on mount without any click.
    expect(screen.getByRole('link', { name: 'Imaging' })).toBeInTheDocument();
    expect(screen.getByText(/did you mean/)).toBeInTheDocument();
  });

  it('Should disable the Add button while the upload is in progress', async () => {
    let resolveUpload: (result: UploadListResult) => void = () => undefined;
    const pendingUpload = jest.fn(
      () =>
        new Promise<UploadListResult>((resolve) => {
          resolveUpload = resolve;
        }),
    );
    const { container } = renderModal({ onUploadList: pendingUpload });

    await upload(makeFile('teams.csv'), container);

    // While parsing, the plus icon is replaced by the spinner and the button
    // is disabled (its accessible name drops the "plus" icon title).
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();

    resolveUpload(uploadResult);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'plus Add' })).toBeEnabled(),
    );
  });

  it('Should show a size error and add no chip when the file is too large', async () => {
    const { container } = renderModal();

    await upload(makeFile('big.csv', 11 * 1000 * 1000), container);

    expect(
      screen.getByText(
        'The file size exceeds the limit of 10 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('big.csv')).not.toBeInTheDocument();
    expect(onUploadList).not.toHaveBeenCalled();
  });

  it('Should reject a file with an unsupported extension', () => {
    const { container } = renderModal();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    // fireEvent bypasses the input's `accept` filter that userEvent enforces.
    fireEvent.change(fileInput, { target: { files: [makeFile('notes.txt')] } });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onUploadList).not.toHaveBeenCalled();
  });

  it('Should ignore a change event with no file selected', () => {
    const { container } = renderModal();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(onUploadList).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('Should re-run the upload when a file chip is removed', async () => {
    const { container } = renderModal();

    await upload(makeFile('teams.csv'), container);
    expect(await screen.findByText('teams.csv')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cross' }));

    await waitFor(() =>
      expect(screen.queryByText('teams.csv')).not.toBeInTheDocument(),
    );
    expect(screen.queryByText('5 Teams')).not.toBeInTheDocument();
  });

  it('Should not show the Add spinner while re-parsing after a chip is removed', async () => {
    let resolveReparse: (result: UploadListResult) => void = () => undefined;
    const reparseMock = jest
      .fn<Promise<UploadListResult>, [File[]]>()
      .mockResolvedValueOnce(uploadResult)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveReparse = resolve;
          }),
      );
    const { container } = renderModal({ onUploadList: reparseMock });

    await userEvent.upload(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      [makeFile('a.csv'), makeFile('b.csv')],
    );
    expect(
      await screen.findByRole('button', { name: 'plus Add' }),
    ).toBeEnabled();

    // Removing a chip re-parses in the background; the Add button keeps its
    // plus icon and stays enabled (no spinner) throughout.
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Cross' })[0] as HTMLElement,
    );
    expect(screen.getByRole('button', { name: 'plus Add' })).toBeEnabled();

    resolveReparse(uploadResult);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'plus Add' })).toBeEnabled(),
    );
  });

  it('Should ignore a parse that resolves after its file was removed', async () => {
    let resolveUpload: (result: UploadListResult) => void = () => undefined;
    const pendingUpload = jest.fn<Promise<UploadListResult>, [File[]]>(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve;
        }),
    );
    const { container } = renderModal({ onUploadList: pendingUpload });

    await upload(makeFile('teams.csv'), container);
    // Remove the chip while its parse is still in flight.
    await userEvent.click(screen.getByRole('button', { name: 'Cross' }));

    // The now-stale parse resolves; its result must not repopulate the panel.
    resolveUpload(uploadResult);
    await waitFor(() =>
      expect(screen.queryByText('teams.csv')).not.toBeInTheDocument(),
    );
    expect(screen.queryByText('5 Teams')).not.toBeInTheDocument();
  });

  it('Should clear the result when the upload parse fails', async () => {
    const { container } = renderModal({
      onUploadList: jest.fn().mockRejectedValue(new Error('nope')),
    });

    await upload(makeFile('teams.csv'), container);

    expect(await screen.findByText('teams.csv')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Add Attendees' }),
      ).toBeDisabled(),
    );
    expect(screen.queryByText('5 Teams')).not.toBeInTheDocument();
  });

  it('Should reset per-team edits when a new file is uploaded', async () => {
    const { container } = renderModal();

    await upload(makeFile('a.csv'), container);
    await userEvent.click(
      await screen.findByRole('button', {
        name: /will be added and marked if attended/,
      }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Imaging' }),
    );
    // Removing the only matched team hides the matched section.
    expect(
      screen.queryByText(/will be added and marked if attended/),
    ).not.toBeInTheDocument();

    // A fresh upload regenerates the result and clears the removal.
    await upload(makeFile('b.csv'), container);
    expect(
      await screen.findByRole('button', {
        name: /will be added and marked if attended/,
      }),
    ).toBeInTheDocument();
  });

  it('Should expand the matched section and remove a matched team', async () => {
    const { container } = renderModal();
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', {
        name: /will be added and marked if attended/,
      }),
    );

    const matchedLink = screen.getByRole('link', { name: 'Imaging' });
    expect(matchedLink).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Remove Imaging' }),
    );

    expect(
      screen.queryByRole('link', { name: 'Imaging' }),
    ).not.toBeInTheDocument();
    // Removing the last matched team hides the whole matched section.
    expect(
      screen.queryByText(/will be added and marked if attended/),
    ).not.toBeInTheDocument();
  });

  it('Should expand the not-matched section and promote a suggestion', async () => {
    const { container } = renderModal();
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', { name: /not matched/ }),
    );

    expect(screen.getByText(/did you mean/)).toBeInTheDocument();
    expect(screen.getByText(/no close match/)).toBeInTheDocument();
    expect(
      screen.getByText(/Add a suggested team to include it/),
    ).toBeInTheDocument();

    const notMatchedSection = screen
      .getByText('2 not matched')
      .closest('button')?.parentElement as HTMLElement;
    await userEvent.click(
      within(notMatchedSection).getByRole('button', { name: /Add/ }),
    );

    expect(screen.getByText('1 not matched')).toBeInTheDocument();
    expect(screen.getByText('2 teams')).toBeInTheDocument();
  });

  it('Should hide the not-matched section when there are none', async () => {
    const { container } = renderModal({
      onUploadList: jest.fn(async () => ({
        matched: uploadResult.matched,
        alreadyInCount: 0,
        unmatched: [],
      })),
    });

    await upload(makeFile('teams.csv'), container);

    expect(
      await screen.findByRole('button', {
        name: /will be added and marked if attended/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/not matched/)).not.toBeInTheDocument();
  });

  it('Should hide the matched section when there are none', async () => {
    const { container } = renderModal({
      onUploadList: jest.fn(async () => ({
        matched: [],
        alreadyInCount: 0,
        unmatched: uploadResult.unmatched,
      })),
    });

    await upload(makeFile('teams.csv'), container);

    expect(await screen.findByText(/not matched/)).toBeInTheDocument();
    expect(
      screen.queryByText(/will be added and marked if attended/),
    ).not.toBeInTheDocument();
  });

  it('Should confirm and pass matched teams and files to onAddAttendees', async () => {
    const { container } = renderModal();
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Add Attendees' }),
    );

    expect(onAddAttendees).toHaveBeenCalledWith(
      [expect.objectContaining({ teamId: 'm1', teamName: 'Imaging' })],
      [expect.objectContaining({ name: 'teams.csv' })],
    );
  });

  it('Should stay usable when confirming fails', async () => {
    const { container } = renderModal({
      onAddAttendees: jest.fn().mockRejectedValue(new Error('nope')),
    });
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Add Attendees' }),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Add Attendees' }),
      ).toBeEnabled(),
    );
  });

  // The back arrow, Cancel and the header X all route through the same
  // requestClose handler, so verify each control returns to the parent.
  it.each<[string, () => HTMLElement]>([
    ['the back arrow', () => screen.getByRole('button', { name: 'Back' })],
    ['Cancel', () => screen.getByRole('button', { name: 'Cancel' })],
    [
      'the header close button',
      () =>
        screen
          .getAllByRole('button', { name: 'Close' })
          .find(
            (button) => !(button as HTMLButtonElement).disabled,
          ) as HTMLElement,
    ],
  ])(
    'Should return to the parent from %s when nothing has changed',
    async (_label, getControl) => {
      renderModal();

      await userEvent.click(getControl());

      expect(onBack).toHaveBeenCalledTimes(1);
    },
  );

  it('Should open the file picker when the Add button is clicked', async () => {
    const { container } = renderModal();

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = jest
      .spyOn(fileInput, 'click')
      .mockImplementation(() => {});

    // The green upload button renders the plus icon (title "plus") plus "Add".
    await userEvent.click(screen.getByRole('button', { name: 'plus Add' }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('Should confirm before discarding and keep editing', async () => {
    const { container } = renderModal();
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Cancel' }),
    );
    expect(
      screen.getByText("You'll lose all unsaved changes if you cancel now."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Keep Editing' }));
    expect(
      screen.queryByRole('button', { name: 'Discard changes' }),
    ).not.toBeInTheDocument();
    expect(onBack).not.toHaveBeenCalled();
  });

  it('Should discard via Cancel and return to the parent', async () => {
    const { container } = renderModal();
    await upload(makeFile('teams.csv'), container);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Cancel' }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
