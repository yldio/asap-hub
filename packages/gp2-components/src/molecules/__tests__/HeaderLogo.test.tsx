import { render } from '@testing-library/react';
import HeaderLogo from '../HeaderLogo';

describe('HeaderLogo', () => {
  it('should render an anchor with the GP2 logo', () => {
    const { getByRole } = render(<HeaderLogo />);
    expect(getByRole('link').querySelector('svg > title')).toHaveTextContent(
      /GP2 Logo/,
    );
  });
  it('should have the small and full logo in the document', () => {
    const { getAllByTitle } = render(<HeaderLogo />);
    const [fullLogo, smallLogo] = getAllByTitle('GP2 Logo');
    expect(fullLogo.closest('a')?.className).toContain('fullLogo');
    expect(fullLogo.closest('a')?.href).toBe(globalThis.location.href);
    expect(smallLogo.closest('a')?.className).toContain('smallLogo');
    expect(smallLogo.closest('a')?.href).toBe(globalThis.location.href);
  });
});
