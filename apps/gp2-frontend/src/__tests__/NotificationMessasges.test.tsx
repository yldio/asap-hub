import { render, screen } from '@testing-library/react';
import NotificationMessages from '../NotificationMessages';

describe('NotificationMessages', () => {
  it('should render the children', () => {
    render(<NotificationMessages>text content</NotificationMessages>);
    expect(screen.getByText('text content')).toBeVisible();
  });
});
