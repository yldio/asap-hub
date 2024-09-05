import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TooltipInfo from '../TooltipInfo';

describe('TooltipInfo', () => {
  it('renders info text', () => {
    render(<TooltipInfo>Test Content</TooltipInfo>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
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
