import {
  EmptyState,
  noOutputsIcon,
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
import { ComponentProps } from 'react';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useTagSearchResults } from './state';

type ResultListProps = {
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
      icon={noOutputsIcon}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      isAdministrator={isAdministrator}
    >
      {
        items.map((result) => {
          // eslint-disable-next-line no-underscore-dangle
          switch (result.__meta.type) {
            case 'output':
              return (
                <OutputCard
                  key={result.id}
                  {...(result as gp2Model.OutputResponse)}
                  isAdministrator={isAdministrator}
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
                  {...(result as gp2Model.EventResponse)}
                />
              );
            case 'user':
              return (
                <UserCard
                  key={result.id}
                  {...(result as gp2Model.UserResponse)}
                />
              );
            default:
              return '';
          }
        })

        //   ))
      }
    </ResultListComponent>
  ) : (
    <EmptyState
      icon={noOutputsIcon}
      title={'No outputs available.'}
      description={
        'When a working group or project has an associated output, it will be listed here.'
      }
    />
  );
};

export default ResultList;
