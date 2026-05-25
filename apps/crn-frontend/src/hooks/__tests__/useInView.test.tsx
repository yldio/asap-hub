import { render, screen, act } from '@testing-library/react';

import { useInView } from '../useInView';

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

const TestComponent = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="target">
      {inView ? 'in view' : 'hidden'}
    </div>
  );
};

describe('useInView', () => {
  const originalIO = global.IntersectionObserver;
  let observerCallback: ObserverCallback;
  let disconnect: jest.Mock;

  beforeEach(() => {
    disconnect = jest.fn();
    observerCallback = () => {};
    global.IntersectionObserver = jest
      .fn()
      .mockImplementation((cb: ObserverCallback) => {
        observerCallback = cb;
        return { observe: jest.fn(), disconnect, unobserve: jest.fn() };
      }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIO;
  });

  it('starts hidden until the element intersects', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('target')).toHaveTextContent('hidden');
  });

  it('latches to in view on intersection and disconnects', () => {
    render(<TestComponent />);
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    expect(screen.getByTestId('target')).toHaveTextContent('in view');
    expect(disconnect).toHaveBeenCalled();
  });

  it('stays in view after scrolling away again', () => {
    render(<TestComponent />);
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });
    expect(screen.getByTestId('target')).toHaveTextContent('in view');
  });

  it('defaults to in view when IntersectionObserver is unavailable', () => {
    global.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;
    render(<TestComponent />);
    expect(screen.getByTestId('target')).toHaveTextContent('in view');
  });
});
