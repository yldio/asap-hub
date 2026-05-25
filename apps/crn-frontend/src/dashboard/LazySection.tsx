import { Frame } from '@asap-hub/frontend-utils';
import { FC, ReactNode } from 'react';

import { useInView } from '../hooks/useInView';

type LazySectionProps = {
  /** Title forwarded to the Suspense Frame. */
  title: string;
  /**
   * Minimum height reserved for the section before it loads, so the page does
   * not jump as deferred sections mount.
   */
  minHeight?: number;
  children: ReactNode;
};

/**
 * Defers mounting (and therefore data fetching) of its children until the
 * section is close to entering the viewport. Until then it renders an
 * empty placeholder that reserves vertical space.
 */
const LazySection: FC<LazySectionProps> = ({
  title,
  minHeight = 200,
  children,
}) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} css={{ minHeight: inView ? undefined : minHeight }}>
      {inView && <Frame title={title}>{children}</Frame>}
    </div>
  );
};

export default LazySection;
