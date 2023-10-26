import { ComponentProps } from 'react';
import {
  EmptyState,
  tag as tagIcon,
  OutputCard,
  ProjectCard,
  UserCard,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  EventCard,
  ResultList as ResultListComponent,
  SearchAndFilter,
} from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { eventMapper } from '../events/EventsList';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useTagSearchResults } from './state';

export type ResultListProps = {
  projectId?: string;
  workingGroupId?: string;
  authorId?: string;
} & Pick<ComponentProps<typeof SearchAndFilter>, 'filters' | 'searchQuery'>;
const ResultList: React.FC<ResultListProps> = ({
  searchQuery,
  filters = new Set(),
  projectId,
  workingGroupId,
  authorId,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const { items, total } = useTagSearchResults({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return total || searchQuery ? (
    <ResultListComponent
      icon={tag}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isAdministrator={isAdministrator}
    >
      {items.map((result) => {
        // eslint-disable-next-line no-underscore-dangle
        switch (result.__meta.type) {
          case 'output':
            return (
              <OutputCard
                key={result.id}
                {...(result as gp2Model.OutputResponse)}
              />
            );
          case 'project':
            return (
              <ProjectCard
                key={result.id}
                {...(result as gp2Model.ProjectResponse)}
              />
            );
          case 'event':
            return (
              <EventCard
                key={result.id}
                {...eventMapper(result as gp2Model.EventResponse)}
              />
            );
          case 'user': {
            const data = result as gp2Model.UserResponse;
            const tags = data.tags.map((tag) => tag.name);
            return <UserCard key={result.id} {...data} tags={tags} />;
          }
          default:
            return '';
        }
      })}
    </ResultListComponent>
  ) : (
    <EmptyState
      icon={tagIcon}
      title={'Explore any tags.'}
      description={
        'All GP2 Hub areas with the selected tags will be listed on this page.'
      }
    />
  );
};

export default ResultList;
