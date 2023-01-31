import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import FundingProvidersModal from '../FundingProvidersModal';

describe('FundingProvidersModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type FundingProvidersModalProps = ComponentProps<
    typeof FundingProvidersModal
  >;
  const defaultProps: FundingProvidersModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderContactInformation = (
    overrides: Partial<FundingProvidersModalProps> = {},
  ) =>
    render(<FundingProvidersModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderContactInformation();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Funding Providers' }),
    );
  });

  it('renders email, secondary email and telephone country code and number', () => {
    renderContactInformation();
    expect(
      screen.getByRole('textbox', {
        name: 'Funding Names (optional)',
      }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const fundingStreams = 'Funding Providers';
    renderContactInformation({
      fundingStreams,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      fundingStreams,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    const fundingStreams = 'Funding Providers';
    renderContactInformation({
      fundingStreams,
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Funding Names (optional)',
      }),
      fundingStreams,
    );

    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
