import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OutputsPage from '../OutputsPage';

describe('OutputsPage', () => {
  it('renders header', () => {
    render(<OutputsPage />);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the banner', () => {
    const bannerText = 'Project procedural form was published successfully.';
    render(<OutputsPage outputBanner={bannerText} />);
    expect(screen.getByText(bannerText)).toBeVisible();
  });
  it('dismissed the banner', () => {
    const bannerText = 'Project procedural form was published successfully.';
    const dismissBanner = jest.fn();
    render(
      <OutputsPage outputBanner={bannerText} dismissBanner={dismissBanner} />,
    );
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(dismissBanner).toHaveBeenCalled();
  });
});
