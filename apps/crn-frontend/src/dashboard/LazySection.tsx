import { Frame } from '@asap-hub/frontend-utils';
import { FC, ReactNode } from 'react';

import { useInView } from '../hooks/useInView';

type LazySectionProps = {
  title: string;
  /** Height reserved before load, to avoid layout jump. */
  minHeight?: number;
  children: ReactNode;
};

// Mounts (and fetches) its children only once near the viewport.
const LazySection: FC<LazySectionProps> = ({
  title,
  minHeight = 200,
  children,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView && <Frame title={title}>{children}</Frame>}
    </div>
  );
};

export default LazySection;
