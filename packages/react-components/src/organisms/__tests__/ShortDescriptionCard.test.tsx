import { render, screen, waitFor } from '@testing-library/react';
import ShortDescriptionCard from '../ShortDescriptionCard';

describe('ShortDescriptionCard', () => {
  const getShortDescription = jest
    .fn()
    .mockResolvedValue('generated short description');
  const onChange = jest.fn();

  it('renders short description and a generate button', () => {
    render(
      <ShortDescriptionCard
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
      <ShortDescriptionCard
        getShortDescription={getShortDescription}
        value="current short description"
        buttonEnabled={false}
      />,
    );

    expect(screen.getByRole('button', { name: /Generate/i })).toBeDisabled();
  });

  it('calls getShortDescription and saves the retrieved value when generate button is clicked', async () => {
    render(
      <ShortDescriptionCard
        enabled
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
      <ShortDescriptionCard
        enabled
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
});
