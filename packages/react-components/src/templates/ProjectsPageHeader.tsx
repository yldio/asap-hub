import { css } from '@emotion/react';
import { projects } from '@asap-hub/routing';

import { Display, Paragraph, TabLink } from '../atoms';
import { rem } from '../pixels';
import { paper, steel } from '../colors';
import {
  networkPageLayoutPaddingStyle,
  defaultPageLayoutPaddingStyle,
} from '../layout';
import { SearchAndFilter } from '../organisms';
import { TabNav } from '../molecules';
import { queryParamString } from '../routing';
import { DiscoveryProjectIcon } from '../icons';
import ResourceProjectIcon from '../icons/resource-project';
import TraineeProjectIcon from '../icons/trainee-project';

const visualHeaderStyles = css({
  padding: `${defaultPageLayoutPaddingStyle} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const descriptionStyles = css({
  maxWidth: '53vw',
  marginBottom: rem(16),
});

const projectTypeDescriptionStyles = css({
  maxWidth: '53vw',
  marginBottom: rem(0),
});

const controlsStyles = css({
  padding: `${networkPageLayoutPaddingStyle} 0`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(48),
});

type Page = 'Discovery' | 'Resource' | 'Trainee';

type ProjectsPageHeaderProps = {
  page: Page;
  filters?: Set<string>;
  onChangeFilter?: (filter: string) => void;
  searchQuery: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  showSearch?: boolean;
};

const projectDescriptions: Record<Page, string> = {
  Discovery:
    'Discovery Projects are collaborative research projects whose primary objective is to advance scientific understanding within a defined theme or area of inquiry. These projects are carried out by Discovery Teams.',
  Resource:
    'Resource Projects are projects whose primary objective is to generate research tools, materials, or infrastructure for the scientific community to leverage, or to re-analyze existing datasets to ensure that maximum insights are gained from data already collected. ',
  Trainee:
    'Trainee Projects provide early-career scientists with dedicated support to expand their expertise and build independent research capacity.',
};

const ProjectsPageHeader: React.FC<ProjectsPageHeaderProps> = ({
  page,
  searchQuery,
  onChangeSearchQuery,
  filters,
  onChangeFilter,
  showSearch = true,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Projects</Display>
      <Paragraph accent="lead" styles={descriptionStyles}>
        Projects are targeted efforts that translate recommendations into action
        to advance the PD field. They address critical research needs, drive
        discovery, or produce shared resources, often with dedicated funding and
        support.
      </Paragraph>
      <TabNav>
        <TabLink
          href={
            projects.template +
            projects({}).discoveryProjects.template +
            queryParamString(searchQuery)
          }
          Icon={() => <DiscoveryProjectIcon />}
        >
          Discovery Projects
        </TabLink>
        <TabLink
          href={
            projects.template +
            projects({}).resourceProjects.template +
            queryParamString(searchQuery)
          }
          Icon={() => <ResourceProjectIcon />}
        >
          Resource Projects
        </TabLink>
        <TabLink
          href={
            projects.template +
            projects({}).traineeProjects.template +
            queryParamString(searchQuery)
          }
          Icon={() => <TraineeProjectIcon />}
        >
          Trainee Projects
        </TabLink>
      </TabNav>
    </div>
    {showSearch && (
      <div css={controlsStyles}>
        <Paragraph accent="lead" styles={projectTypeDescriptionStyles}>
          {projectDescriptions[page]}
        </Paragraph>
        <SearchAndFilter
          onChangeSearch={onChangeSearchQuery}
          searchQuery={searchQuery}
          onChangeFilter={onChangeFilter}
          filters={filters}
          filterOptions={[]}
          searchPlaceholder="Enter project name, keyword, theme, …"
        />
      </div>
    )}
  </header>
);

export default ProjectsPageHeader;
