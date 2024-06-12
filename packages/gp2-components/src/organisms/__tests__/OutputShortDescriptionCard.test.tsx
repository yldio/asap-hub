import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import OutputShortDescriptionCard from '../OutputShortDescriptionCard';

describe('OutputShortDescriptionCard', () => {
  const getShortDescription = jest
    .fn()
    .mockResolvedValue('generated short description');
  const onChange = jest.fn();

  it('renders short description and a generate button', () => {
    render(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
      />,
    );

    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('current short description');
    expect(screen.getByRole('button', { name: /Generate/i })).toBeVisible();
  });

  it('disables the button when buttonEnabled property is set to false', () => {
    render(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
        buttonEnabled={false}
      />,
    );

    expect(screen.getByRole('button', { name: /Generate/i })).toBeDisabled();
  });

  it('calls getShortDescription and saves the retrieved value when generate button is clicked', async () => {
    render(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
        onChange={onChange}
      />,
    );

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    generateButton.click();

    expect(getShortDescription).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('generated short description');
    });
  });

  it('button should say Regenerate after generting the first time', async () => {
    render(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
      />,
    );

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    generateButton.click();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Generate/i }),
      ).toHaveTextContent('Regenerate');
    });
  });

  it('shows the error message when short description is empty but removes it once text is generated', async () => {
    const { rerender, getByRole } = render(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value=""
      />,
    );

    fireEvent.focusOut(getByRole('textbox'));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a short description/i),
      ).toBeVisible();
    });

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    generateButton.click();

    rerender(
      <OutputShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
      />,
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Please enter a short description/i),
      ).not.toBeInTheDocument();
    });
  });
});
