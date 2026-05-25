import { render, screen, act } from '@testing-library/react';

import LazySection from '../LazySection';

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

describe('LazySection', () => {
  const originalIO = global.IntersectionObserver;
  let observerCallback: ObserverCallback;

  beforeEach(() => {
    observerCallback = () => {};
    global.IntersectionObserver = jest
      .fn()
      .mockImplementation((cb: ObserverCallback) => {
        observerCallback = cb;
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
          unobserve: jest.fn(),
        };
      }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIO;
  });

  it('does not render children until the section is in view', () => {
    render(
      <LazySection title="Latest Users">
        <div>section content</div>
      </LazySection>,
    );
    expect(screen.queryByText('section content')).not.toBeInTheDocument();
  });

  it('renders children once the section comes into view', () => {
    render(
      <LazySection title="Latest Users">
        <div>section content</div>
      </LazySection>,
    );
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    expect(screen.getByText('section content')).toBeInTheDocument();
  });
});
