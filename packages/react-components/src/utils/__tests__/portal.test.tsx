import { render, screen, within } from '@testing-library/react';
import {
  act as testRendererAct,
  create as createTestRenderer,
  ReactTestRenderer,
} from 'react-test-renderer';

import { Portal, PortalContainer, portalContainerId } from '../portal';

const removePortalContainer = (containerId = portalContainerId) => {
  document.getElementById(containerId)?.remove();
};

afterEach(() => {
  removePortalContainer();
  removePortalContainer('custom-portal-root');
});

describe('PortalContainer', () => {
  it('creates a portal container at the root of the body', () => {
    const { container, unmount } = render(<PortalContainer />);

    const portalContainer = document.getElementById(portalContainerId);

    expect(container).toBeEmptyDOMElement();
    expect(portalContainer).toBeInTheDocument();
    expect(portalContainer?.parentElement).toBe(document.body);

    unmount();

    expect(document.getElementById(portalContainerId)).not.toBeInTheDocument();
  });

  it('leaves an existing portal container in place on unmount', () => {
    const portalContainer = document.createElement('div');
    portalContainer.id = portalContainerId;
    document.body.appendChild(portalContainer);

    const { unmount } = render(<PortalContainer />);

    expect(document.getElementById(portalContainerId)).toBe(portalContainer);

    unmount();

    expect(document.getElementById(portalContainerId)).toBe(portalContainer);
  });
});

describe('Portal', () => {
  it('renders children into an existing portal container', () => {
    const portalContainer = document.createElement('div');
    portalContainer.id = portalContainerId;
    document.body.appendChild(portalContainer);

    render(
      <Portal>
        <span>Portal child</span>
      </Portal>,
    );

    expect(within(portalContainer).getByText('Portal child')).toBeVisible();
  });

  it('creates a portal container when one does not exist', async () => {
    render(
      <Portal containerId="custom-portal-root">
        <span>Custom portal child</span>
      </Portal>,
    );

    expect(await screen.findByText('Custom portal child')).toBeVisible();
    expect(document.getElementById('custom-portal-root')).toContainElement(
      screen.getByText('Custom portal child'),
    );
  });

  it('renders nothing when document is unavailable', async () => {
    const documentDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'document',
    );
    let testRenderer: ReactTestRenderer | undefined;

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    try {
      await testRendererAct(() => {
        testRenderer = createTestRenderer(
          <>
            <PortalContainer />
            <Portal>
              <span>Portal child</span>
            </Portal>
          </>,
        );
      });

      expect(testRenderer?.toJSON()).toBeNull();
    } finally {
      await testRendererAct(() => {
        testRenderer?.unmount();
      });

      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      }
    }
  });
});
