import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CtaCard from '../CtaCard';

it('renders a cta card with contact button', () => {
  const { getByRole } = render(
    <CtaCard href="test123" buttonText="Button">
      content
    </CtaCard>,
  );
  const link = getByRole('link');
  expect(link).toHaveAttribute('href', 'test123');
  expect(link.textContent).toEqual('Button');
});

it('renders a cta card with copy email button', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
  jest.spyOn(navigator.clipboard, 'writeText');
  const { getByRole } = render(
    <CtaCard href="mailto:test123@gmail.com" buttonText="Button" displayCopy>
      content
    </CtaCard>,
  );

  const copyButton = getByRole('button', { name: 'Copy' });
  expect(copyButton).toBeVisible();
  userEvent.click(copyButton);
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    'test123@gmail.com',
  );
});

it('renders a cta card with children', () => {
  const { getByText } = render(
    <CtaCard href="test123" buttonText="Button">
      content
    </CtaCard>,
  );
  const content = getByText('content');
  expect(content).toBeVisible();
});
