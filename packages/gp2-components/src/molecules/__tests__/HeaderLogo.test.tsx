import { render, screen } from '@testing-library/react';
import HeaderLogo from '../HeaderLogo';

describe('HeaderLogo', () => {
  it('should render an anchor with the GP2 logo', () => {
    render(<HeaderLogo />);
    expect(screen.getByRole('link').firstChild).toHaveTextContent(/GP2 Logo/);
  });
  it('should have the right link when the logoHref is provided', () => {
    render(<HeaderLogo logoHref={'http://example.com'} />);
    const [smallLogo] = screen.getAllByTitle('GP2 Logo');
    expect(smallLogo!.closest('a')?.href).toBe('http://example.com/');
  });
});
