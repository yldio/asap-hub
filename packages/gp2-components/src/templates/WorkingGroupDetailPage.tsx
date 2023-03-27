import { pixels } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { mainStyles } from '../layout';

import WorkingGroupDetailHeader from '../organisms/WorkingGroupDetailHeader';

type WorkingGroupDetailPageProps = ComponentProps<
  typeof WorkingGroupDetailHeader
>;

const { rem } = pixels;

const WorkingGroupDetailPage: React.FC<WorkingGroupDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article>
    <WorkingGroupDetailHeader {...headerProps} />
    <main css={[mainStyles, { padding: `${rem(32)} 0` }]}>{children}</main>
  </article>
);

export default WorkingGroupDetailPage;
