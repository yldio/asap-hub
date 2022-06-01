import { render, screen } from '@testing-library/react';
import HeaderLogo from '../HeaderLogo';

describe('HeaderLogo', () => {
  it('should render an anchor with the GP2 logo', () => {
    render(<HeaderLogo />);
    expect(screen.getByRole('link').firstChild).toHaveTextContent(/GP2 Logo/);
  });
  it('should have the small and full logo in the document', () => {
    render(<HeaderLogo />);
    const [fullLogo, smallLogo] = screen.getAllByTitle('GP2 Logo');
    expect(fullLogo.closest('a')?.className).toContain('fullLogo');
    expect(fullLogo.closest('a')?.href).toBe(globalThis.location.href);
    expect(smallLogo.closest('a')?.className).toContain('smallLogo');
    expect(smallLogo.closest('a')?.href).toBe(globalThis.location.href);
  });
});
