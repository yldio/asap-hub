import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TooltipInfo from '../TooltipInfo';

const realMatchMedia = window.matchMedia;
afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: realMatchMedia,
  });
});

describe('TooltipInfo', () => {
  it('renders info text', () => {
    render(<TooltipInfo>Test Content</TooltipInfo>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('opens on hover and closes again when openOnHover is set', async () => {
    render(<TooltipInfo openOnHover>Test Content</TooltipInfo>);
    const infoButton = screen.getByRole('button', { name: /info/i });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.hover(infoButton);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test Content');

    await userEvent.unhover(infoButton);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('ignores hover by default', async () => {
    render(<TooltipInfo>Test Content</TooltipInfo>);

    await userEvent.hover(screen.getByRole('button', { name: /info/i }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('stays open when the hovered icon is clicked', async () => {
    render(<TooltipInfo openOnHover>Test Content</TooltipInfo>);

    await userEvent.click(screen.getByRole('button', { name: /info/i }));

    expect(screen.getByRole('tooltip')).toHaveTextContent('Test Content');
  });

  it('opens on keyboard focus and closes on blur', async () => {
    render(<TooltipInfo openOnHover>Test Content</TooltipInfo>);

    await userEvent.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test Content');

    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('ignores hover on a device that cannot hover', async () => {
    const matchMedia = jest.fn().mockReturnValue({ matches: false });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: matchMedia,
    });
    render(<TooltipInfo openOnHover>Test Content</TooltipInfo>);

    await userEvent.hover(screen.getByRole('button', { name: /info/i }));

    expect(matchMedia).toHaveBeenCalledWith('(hover: hover)');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('calls preventDefault when user clicks on the button', () => {
    render(<TooltipInfo>Test Content</TooltipInfo>);

    const infoButton = screen.getByRole('button', { name: /info/i });
    const buttonClick = createEvent.click(infoButton);
    buttonClick.preventDefault = jest.fn();
    fireEvent(infoButton, buttonClick);
    expect(buttonClick.preventDefault).toHaveBeenCalled();
  });
});
