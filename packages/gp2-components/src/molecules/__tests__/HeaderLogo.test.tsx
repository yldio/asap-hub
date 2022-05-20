import { render } from '@testing-library/react';
import HeaderLogo from '../HeaderLogo';

describe('HeaderLogo', () => {
  it('should render an anchor with the GP2 logo', () => {
    const { getByRole } = render(<HeaderLogo />);
    expect(getByRole('link').querySelector('svg > title')).toHaveTextContent(
      /GP2 Logo/,
    );
  });
});
