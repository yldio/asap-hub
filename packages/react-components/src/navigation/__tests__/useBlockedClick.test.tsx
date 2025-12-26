import { fireEvent, render, screen } from '@testing-library/react';
import { useEffect, MouseEvent } from 'react';
import {
  NavigationBlockerProvider,
  useNavigationBlocker,
} from '../NavigationBlockerContext';
import { useBlockedClick } from '../useBlockedClick';

describe('useBlockedClick', () => {
  beforeEach(() => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls original onClick when not blocked', () => {
    const originalOnClick = jest.fn();

    const TestComponent = () => {
      const blockedClick = useBlockedClick(originalOnClick);
      return <button onClick={blockedClick}>Click me</button>;
    };

    render(
      <NavigationBlockerProvider>
        <TestComponent />
      </NavigationBlockerProvider>,
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(originalOnClick).toHaveBeenCalledTimes(1);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('shows confirm when blocked and calls onClick if confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const originalOnClick = jest.fn();

    const TestComponent = () => {
      const { register } = useNavigationBlocker();
      const blockedClick = useBlockedClick(originalOnClick);

      useEffect(() => {
        const cleanup = register('Are you sure?');
        return cleanup;
      }, [register]);

      return <button onClick={blockedClick}>Click me</button>;
    };

    render(
      <NavigationBlockerProvider>
        <TestComponent />
      </NavigationBlockerProvider>,
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
    expect(originalOnClick).toHaveBeenCalledTimes(1);
  });

  it('prevents default and does not call onClick when blocked and user cancels', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const originalOnClick = jest.fn();

    const TestComponent = () => {
      const { register } = useNavigationBlocker();
      const blockedClick = useBlockedClick(originalOnClick);

      useEffect(() => {
        const cleanup = register('Are you sure?');
        return cleanup;
      }, [register]);

      return <button onClick={blockedClick}>Click me</button>;
    };

    render(
      <NavigationBlockerProvider>
        <TestComponent />
      </NavigationBlockerProvider>,
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
    expect(originalOnClick).not.toHaveBeenCalled();
  });

  it('works when no original onClick is provided', () => {
    const TestComponent = () => {
      const blockedClick = useBlockedClick();
      return <button onClick={blockedClick}>Click me</button>;
    };

    render(
      <NavigationBlockerProvider>
        <TestComponent />
      </NavigationBlockerProvider>,
    );

    // Should not throw
    fireEvent.click(screen.getByText('Click me'));
  });

  it('works without provider (passthrough behavior)', () => {
    const originalOnClick = jest.fn();

    const TestComponent = () => {
      const blockedClick = useBlockedClick(originalOnClick);
      return <button onClick={blockedClick}>Click me</button>;
    };

    // Render without NavigationBlockerProvider
    render(<TestComponent />);

    fireEvent.click(screen.getByText('Click me'));
    expect(originalOnClick).toHaveBeenCalledTimes(1);
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('passes event to original onClick handler', () => {
    const originalOnClick = jest.fn((e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    });

    const TestComponent = () => {
      const blockedClick = useBlockedClick(originalOnClick);
      return <button onClick={blockedClick}>Click me</button>;
    };

    render(
      <NavigationBlockerProvider>
        <TestComponent />
      </NavigationBlockerProvider>,
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(originalOnClick).toHaveBeenCalledTimes(1);
    expect(originalOnClick.mock.calls[0]![0]).toHaveProperty('preventDefault');
  });
});
