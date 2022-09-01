import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailSection from '../EmailSection';

describe('EmailSection', () => {
  const defaultProps = {
    contactEmails: [{ email: 'test@example.com', contact: 'Manager of team' }],
  };
  it('renders list of email and title', () => {
    render(<EmailSection {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: 'Manager of team' }),
    ).toBeVisible();

    expect(
      (
        screen.getByRole('link', {
          name: 'test@example.com',
        }) as HTMLAnchorElement
      ).href,
    ).toMatchInlineSnapshot(`"mailto:test@example.com"`);
  });
  it('copy button adds email to clipboard', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: () => {},
      },
    });
    jest.spyOn(navigator.clipboard, 'writeText');
    render(<EmailSection {...defaultProps} />);
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    expect(copyButton).toBeVisible();
    userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'test@example.com',
    );
  });
});
