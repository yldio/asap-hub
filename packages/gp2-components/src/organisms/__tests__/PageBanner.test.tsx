import { render, screen } from '@testing-library/react';
import PageBanner from '../PageBanner';

describe('PageBanner', () => {
  it('renders the header title', () => {
    render(<PageBanner title="User Directory" description="" image="" />);
    expect(screen.getByRole('heading')).toHaveTextContent('User Directory');
  });
  it('renders the description', () => {
    render(
      <PageBanner title="" description="test header description" image="" />,
    );
    expect(screen.getByText('test header description')).toBeVisible();
  });
  it('uses the image as a background-image', () => {
    render(<PageBanner title="" description="" image="image.png" />);
    const imageContainer = screen.getByRole('banner').firstElementChild;
    expect(imageContainer).toBeVisible();
    expect(getComputedStyle(imageContainer!).backgroundImage).toBe(
      'url(image.png)',
    );
  });
  it('uses the position as a background-position', () => {
    render(
      <PageBanner title="" position="top" description="" image="image.png" />,
    );
    const imageContainer = screen.getByRole('banner').firstElementChild;
    expect(imageContainer).toBeVisible();
    expect(getComputedStyle(imageContainer!).backgroundPosition).toBe('top');
  });
});
