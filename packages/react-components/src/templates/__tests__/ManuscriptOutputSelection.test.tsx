import { ManuscriptLifecycle, ManuscriptType } from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useHistory } from 'react-router-dom';
import ManuscriptOutputSelection from '../ManuscriptOutputSelection';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

describe('ManuscriptOutputSelection', () => {
  const mockHistory = {
    goBack: jest.fn(),
  };

  const defaultProps = {
    isImportingManuscript: false,
    manuscriptOutputSelection: '' as '' | 'manually' | 'import',
    onChangeManuscriptOutputSelection: jest.fn(),
    onSelectCreateManually: jest.fn(),
    getManuscriptVersionOptions: jest.fn(),
    onImportManuscript: jest.fn(),
    setSelectedVersion: jest.fn(),
  };

  beforeEach(() => {
    (useHistory as jest.Mock).mockReturnValue(mockHistory);
    jest.clearAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<ManuscriptOutputSelection {...defaultProps} />);

    expect(
      screen.getByText('How would you like to create your output?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select the type of output you want to create:'),
    ).toBeInTheDocument();
    expect(screen.getByText('Create manually')).toBeInTheDocument();
    expect(screen.getByText('Import from manuscript')).toBeInTheDocument();
  });

  it('handles radio button selection', async () => {
    render(<ManuscriptOutputSelection {...defaultProps} />);

    const manuallyOption = screen.getByLabelText('Create manually');
    await userEvent.click(manuallyOption);

    expect(defaultProps.onChangeManuscriptOutputSelection).toHaveBeenCalledWith(
      'manually',
    );
  });

  it('shows manuscript import section when import is selected', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
      />,
    );

    expect(screen.getByText('Manuscript')).toBeInTheDocument();
    expect(
      screen.getByText(
        "Only the latest version of the manuscript is available for import. If the first preprint version hasn't been imported yet, it will be added automatically.",
      ),
    ).toBeInTheDocument();
  });

  it('hides manuscript import section when manually is selected', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="manually"
      />,
    );

    expect(screen.queryByText('Manuscript')).not.toBeInTheDocument();
  });

  it('shows action buttons when a selection is made', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="manually"
      />,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('hides action buttons when no selection is made', () => {
    render(<ManuscriptOutputSelection {...defaultProps} />);

    expect(
      screen.queryByRole('button', { name: 'Cancel' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
  });

  it('handles cancel button click', async () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="manually"
      />,
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    expect(mockHistory.goBack).toHaveBeenCalled();
  });

  it('handles create button click when manually selected', async () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="manually"
      />,
    );

    const createButton = screen.getByRole('button', { name: 'Create' });
    await userEvent.click(createButton);

    expect(defaultProps.onSelectCreateManually).toHaveBeenCalled();
  });

  it('shows import button when import is selected', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
      />,
    );

    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('disables import button when import is selected', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
      />,
    );

    const importButton = screen.getByRole('button', { name: 'Import' });
    expect(importButton).toBeDisabled();
  });

  it('shows message when no suggestions are found', async () => {
    const { getByRole, getByText, queryByText } = render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
        getManuscriptVersionOptions={jest.fn().mockResolvedValue([])}
      />,
    );

    userEvent.type(getByRole('textbox'), 'asdflkjasdflkj');

    await waitFor(() =>
      expect(queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(
      getByText('Sorry, no manuscripts match asdflkjasdflkj'),
    ).toBeVisible();
  });

  it('lets a user select a version', async () => {
    const mockOption = {
      label: 'Version One',
      value: 'mv-version-1',
      version: {
        manuscriptId: '123',
        type: 'Original Research',
        lifecycle: 'Preprint',
      },
    };
    const setSelectedVersion = jest.fn();

    const getOptions = jest.fn().mockResolvedValue([mockOption]);

    const { getByRole } = render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
        getManuscriptVersionOptions={getOptions}
        setSelectedVersion={setSelectedVersion}
      />,
    );

    const input = getByRole('textbox');
    await userEvent.type(input, 'Version');
    // await userEvent.tab();
    const option = await screen.findByText('Version One');
    await userEvent.click(option);

    await waitFor(() => {
      expect(setSelectedVersion).toHaveBeenCalledWith(mockOption);
    });
  });

  it('displays selected version', async () => {
    const mockOption = {
      label: 'Version One',
      value: 'mv-manuscript-1',
      version: {
        id: 'mv-manuscript-1',
        title: 'Version One',
        url: 'https://example.com',
        manuscriptId: '123',
        type: 'Original Research' as ManuscriptType,
        lifecycle: 'Preprint' as ManuscriptLifecycle,
      },
    };

    const getOptions = jest.fn().mockResolvedValue([mockOption]);

    const { findByText, getByText } = render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
        getManuscriptVersionOptions={getOptions}
        selectedVersion={mockOption}
      />,
    );

    expect(await findByText('Preprint')).toBeInTheDocument();
    expect(getByText('Original Research')).toBeInTheDocument();
    expect(getByText('123')).toBeInTheDocument();
  });

  it('shows loading animation when importing manuscript', () => {
    render(
      <ManuscriptOutputSelection
        {...defaultProps}
        manuscriptOutputSelection="import"
        isImportingManuscript={true}
        selectedVersion={{
          label: 'Test Version',
          value: 'test-version',
          version: {
            id: 'test-version',
            title: 'Test Version',
            url: 'https://example.com',
            manuscriptId: '123',
            type: 'Original Research' as ManuscriptType,
            lifecycle: 'Preprint' as ManuscriptLifecycle,
          },
        }}
      />,
    );

    const importButton = screen.getByRole('button', { name: /Import/i });
    expect(importButton).toBeDisabled();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
