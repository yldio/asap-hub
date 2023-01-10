import { render } from '@testing-library/react';
import SocialSubGroup from '../SocialSubGroup';

describe('SocialSubGroup', () => {
  it('renders a sub group with a title and the social links', async () => {
    const props = {
      title: 'Sub Group Test',
      list: [
        {
          key: 'test-1',
          link: 'https://www.test.com',
          icon: <svg />,
          displayName: 'Test 1',
        },
        {
          key: 'test-2',
          link: 'https://www.test.com',
          icon: <svg />,
          displayName: 'Test 2',
        },
      ],
    };
    const { findByText, findAllByRole } = render(<SocialSubGroup {...props} />);

    expect(await findByText('Sub Group Test')).toBeVisible();
    expect((await findAllByRole('link')).length).toBe(2);
  });
});
