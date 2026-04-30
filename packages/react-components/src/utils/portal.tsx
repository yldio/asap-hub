import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const portalContainerId = 'asap-hub-portal-root';

const getPortalContainer = (containerId: string) =>
  typeof document === 'undefined' ? null : document.getElementById(containerId);

const createPortalContainer = (containerId: string) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const container = document.createElement('div');
  container.id = containerId;
  document.body.appendChild(container);

  return container;
};

const ensurePortalContainer = (containerId: string) =>
  getPortalContainer(containerId) ?? createPortalContainer(containerId);

export const PortalContainer: React.FC = () => {
  useEffect(() => {
    if (getPortalContainer(portalContainerId)) {
      return undefined;
    }

    const container = createPortalContainer(portalContainerId);

    return () => {
      container?.remove();
    };
  }, []);

  return null;
};

type PortalProps = {
  readonly children: ReactNode;
  readonly containerId?: string;
};

export const Portal: React.FC<PortalProps> = ({
  children,
  containerId = portalContainerId,
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(() =>
    getPortalContainer(containerId),
  );

  useEffect(() => {
    setContainer(ensurePortalContainer(containerId));
  }, [containerId]);

  return container ? createPortal(children, container) : null;
};
