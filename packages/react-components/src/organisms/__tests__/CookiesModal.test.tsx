import { ThemeProvider } from '@emotion/react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LogoProvider } from '../..';
import CookiesModal from '../CookiesModal';

describe('CookiesModal', () => {
  const mockOnSaveCookiePreferences = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderCookiesModal = async () => {
    const view = render(
      <LogoProvider appName="CRN">
        <ThemeProvider theme={{}}>
          <CookiesModal onSaveCookiePreferences={mockOnSaveCookiePreferences} />
        </ThemeProvider>
      </LogoProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    return view;
  };

  it('renders the modal with all essential elements', async () => {
    await renderCookiesModal();

    expect(screen.getByTitle('CRN Logo')).toBeInTheDocument();

    expect(screen.getByText('Privacy Preference Center')).toBeInTheDocument();
    expect(
      screen.getByText('Manage Consent Preferences by Category'),
    ).toBeInTheDocument();

    expect(screen.getByText('Essential')).toBeInTheDocument();
    expect(screen.getByText('Always Active')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();

    expect(screen.getByLabelText('Toggle switch')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save and close/i }),
    ).toBeInTheDocument();
  });

  it('toggles analytics consent when switch is clicked', async () => {
    await renderCookiesModal();

    const switchElement = screen.getByLabelText('Toggle switch');

    expect(switchElement).not.toBeChecked();

    userEvent.click(switchElement);
    expect(switchElement).toBeChecked();

    userEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  it('calls onSaveCookiePreferences with correct value when saving', async () => {
    await renderCookiesModal();

    const switchElement = screen.getByLabelText('Toggle switch');
    const saveButton = screen.getByRole('button', { name: /save and close/i });

    userEvent.click(saveButton);
    expect(mockOnSaveCookiePreferences).toHaveBeenCalledWith(false);

    userEvent.click(switchElement);
    userEvent.click(saveButton);
    expect(mockOnSaveCookiePreferences).toHaveBeenCalledWith(true);
  });

  it('displays the third party cookie pills', async () => {
    await renderCookiesModal();

    expect(screen.getAllByText(/third party cookie/i)).toHaveLength(3);
  });
});
