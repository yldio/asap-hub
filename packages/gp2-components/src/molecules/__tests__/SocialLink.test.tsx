import { render } from '@testing-library/react';
import SocialLink from '../SocialLink';

describe('SocialLink', () => {
  it('renders a Link with an icon and a label', () => {
    const props = {
      key: 'test',
      link: 'https://www.test.com',
      icon: <svg />,
      displayName: 'Test',
    };

    const { getByRole } = render(<SocialLink {...props} />);

    const link = getByRole('link');
    expect(link).toContainHTML('<svg');
    expect(link).toHaveTextContent('Test');
    expect(link).toHaveAttribute('href', props.link);
  });
});
