import { pixels, TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { layoutContentStyles } from '../layout';
import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

const { rem } = pixels;

const navStyles = css({
  marginTop: rem(32),
});

const WorkingGroupsPage: React.FC<React.PropsWithChildren> = ({ children }) => (
  <article css={layoutContentStyles}>
    <WorkingGroupsHeader>
      <div css={navStyles}>
        <TabNav>
          <TabLink href={gp2.workingGroups.DEFAULT.OPERATIONAL.buildPath({})}>
            Operational
          </TabLink>
          <TabLink href={gp2.workingGroups.DEFAULT.SUPPORT.buildPath({})}>
            Support
          </TabLink>
          <TabLink
            href={gp2.workingGroups.DEFAULT.COMPLEX_DISEASE.buildPath({})}
          >
            Complex Disease
          </TabLink>
          <TabLink href={gp2.workingGroups.DEFAULT.MONOGENIC.buildPath({})}>
            Monogenic
          </TabLink>
        </TabNav>
      </div>
    </WorkingGroupsHeader>
    <main>{children}</main>
  </article>
);

export default WorkingGroupsPage;
