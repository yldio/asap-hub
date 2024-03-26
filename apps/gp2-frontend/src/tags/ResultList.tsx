import {
  EmptyState,
  tagIcon,
  OutputCard,
  ProjectCard,
  UserCard,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  EventCard,
  ResultList as ResultListComponent,
} from '@asap-hub/react-components';
import { eventMapper } from '../events/EventsList';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useTagSearchResults } from './state';
import { useSearch } from '../hooks';

export type ResultListProps = {
  filters?: Set<gp2Model.EntityType>;
};
const ResultList: React.FC<ResultListProps> = ({ filters = new Set() }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { tags } = useSearch();
  const { items, total } = useTagSearchResults({
    tags,
    entityType: filters,
    currentPage,
    pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return total && tags.length > 0 ? (
    <ResultListComponent
      icon={tagIcon}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
    >
      {items.map((result) => {
        // eslint-disable-next-line no-underscore-dangle
        switch (result.__meta.type) {
          case 'output':
            return (
              <OutputCard
                key={result.id}
                showTags
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
            const tagData = data.tags.map((tag) => tag.name);
            return <UserCard key={result.id} {...data} tags={tagData} />;
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
