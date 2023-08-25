import { gp2 } from '@asap-hub/model';
import {
  pixels,
  ResultList,
  SearchAndFilter,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { noProjectsIcon } from '../icons';
import { EmptyState } from '../molecules';
import ProjectCard from './ProjectCard';

const { rem } = pixels;

export type ProjectsBodyProps = Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'searchQuery' | 'onChangeFilter' | 'onChangeSearch'
> & {
  projects: gp2.ListProjectResponse['items'];
} & Omit<ComponentProps<typeof ResultList>, 'children'>;

const containerStyles = css({
  marginTop: rem(48),
});

const gridContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: rem(24),
  marginTop: rem(48),
});

const filterOptions = [
  { title: 'STATUS' },
  ...gp2.projectStatus.map((value) => ({ label: value, value })),
  { title: 'TYPE' },
  { label: gp2.opportunitiesAvailable, value: gp2.opportunitiesAvailable },
  { label: gp2.traineeProject, value: gp2.traineeProject },
];

const ProjectsBody: React.FC<ProjectsBodyProps> = ({
  filters,
  searchQuery,
  onChangeFilter,
  onChangeSearch,
  projects,
  numberOfItems,
  numberOfPages,
  currentPageIndex,
  renderPageHref,
}) => (
  <article css={containerStyles}>
    <SearchAndFilter
      onChangeSearch={onChangeSearch}
      onChangeFilter={onChangeFilter}
      filterOptions={filterOptions}
      filters={filters}
      searchPlaceholder="Enter name or keyword..."
      searchQuery={searchQuery}
    />
    {projects.length ? (
      <div css={gridContainerStyles}>
        <ResultList
          numberOfItems={numberOfItems}
          numberOfPages={numberOfPages}
          currentPageIndex={currentPageIndex}
          renderPageHref={renderPageHref}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </ResultList>
      </div>
    ) : (
      <div style={{ marginTop: rem(80) }}>
        <EmptyState
          icon={noProjectsIcon}
          title={'No projects available.'}
          description={
            'When a GP2 admin creates a project, it will be listed here.'
          }
        />
      </div>
    )}
  </article>
);

export default ProjectsBody;
