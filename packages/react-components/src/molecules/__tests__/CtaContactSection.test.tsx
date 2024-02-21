import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CtaContactSection from '../CtaContactSection';

it('renders with copy email button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
  jest.spyOn(navigator.clipboard, 'writeText');
  const { getByRole } = render(
    <CtaContactSection
      href="mailto:test123@gmail.com"
      buttonText="Contact PM"
      displayCopy
    />,
  );

  const copyButton = getByRole('button', { name: 'Copy' });
  expect(copyButton).toBeVisible();
  userEvent.click(copyButton);
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    'test123@gmail.com',
  );
});

it('renders without copy email button', () => {
  const { queryByRole } = render(
    <CtaContactSection
      href="mailto:test123@gmail.com"
      buttonText="Contact PM"
    />,
  );

  expect(queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
});
