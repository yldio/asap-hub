import { gp2 as gp2Model } from '@asap-hub/model';
import {
  BackLink,
  drawerQuery,
  pixels,
  Subtitle,
  TabLink,
  TabNav,
  utils,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';

import { css } from '@emotion/react';

import projectIcon from '../icons/project-icon';
import usersIcon from '../icons/users-icon';
import { projectsImage } from '../images';
import CardWithBackground from '../molecules/CardWithBackground';
import IconWithLabel from '../molecules/IconWithLabel';

const { rem } = pixels;

type ProjectDetailHeaderProps = Pick<
  gp2Model.ProjectResponse,
  'title' | 'members' | 'id'
> & {
  projects?: unknown[];
  backHref: string;
};

const infoContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(32),
  [drawerQuery]: {
    display: 'unset',
  },
});

const { getCounterString } = utils;

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  backHref,
  title,
  members,
  projects,
  id,
}) => (
  <header>
    <BackLink href={backHref} />
    <CardWithBackground image={projectsImage}>
      <Subtitle>Project</Subtitle>
      <h2>{title}</h2>
      <div css={infoContainerStyles}>
        <IconWithLabel icon={usersIcon}>
          {getCounterString(members.length, 'member')}
        </IconWithLabel>
        <IconWithLabel icon={projectIcon}>
          {getCounterString(projects?.length || 0, 'project')}
        </IconWithLabel>
      </div>
    </CardWithBackground>
    <TabNav>
      <TabLink href={gp2Routing.projects({}).project({ projectId: id }).$}>
        Overview
      </TabLink>
    </TabNav>
  </header>
);
export default ProjectDetailHeader;
