import { pixels, TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { layoutContentStyles } from '../layout';
import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

const { rem } = pixels;

const navStyles = css({
  marginTop: rem(32),
});

const WorkingGroupsPage: React.FC = ({ children }) => (
  <article css={layoutContentStyles}>
    <WorkingGroupsHeader>
      <div css={navStyles}>
        <TabNav>
          <TabLink href={gp2.workingGroups({}).operational({}).$}>
            Operational
          </TabLink>
          <TabLink href={gp2.workingGroups({}).support({}).$}>Support</TabLink>
          <TabLink href={gp2.workingGroups({}).complexDisease({}).$}>
            Complex Disease
          </TabLink>
          <TabLink href={gp2.workingGroups({}).monogenic({}).$}>
            Monogenic
          </TabLink>
        </TabNav>
      </div>
    </WorkingGroupsHeader>
    <main>{children}</main>
  </article>
);

export default WorkingGroupsPage;
