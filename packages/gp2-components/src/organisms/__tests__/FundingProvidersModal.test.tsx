import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import FundingProviderModal from '../FundingProviderModal';

describe('FundingProviderModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type FundingProviderModalProps = ComponentProps<typeof FundingProviderModal>;
  const defaultProps: FundingProviderModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderContactInformation = (
    overrides: Partial<FundingProviderModalProps> = {},
  ) =>
    render(<FundingProviderModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderContactInformation();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Funding Providers' }),
    );
  });

  it('renders funding providers', () => {
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
      fundingStreams: '',
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Funding Names (optional)',
      }),
      fundingStreams,
    );

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      fundingStreams,
    });

    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
