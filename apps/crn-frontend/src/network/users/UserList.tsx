import { UserListItemResponse } from '@asap-hub/model';
import { NetworkPeople } from '@asap-hub/react-components';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import { format } from 'date-fns';

import { useUsers } from './state';
import { getUsers } from './api';
import { userToCSV, MAX_ALGOLIA_RESULTS } from './export';
import { useAlgolia } from '../../hooks/algolia';
import {
  usePaginationParams,
  usePagination,
  CARD_VIEW_PAGE_SIZE,
} from '../../hooks';
import { usePrefetchTeams } from '../teams/state';
import { usePrefetchInterestGroups } from '../interest-groups/state';
import { usePrefetchWorkingGroups } from '../working-groups/state';

interface UserListProps {
  searchQuery?: string;
  filters?: Set<string>;
}

const UserList: React.FC<UserListProps> = ({
  searchQuery = '',
  filters = new Set(),
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const user = useCurrentUserCRN();
  const { client } = useAlgolia();

  const result = useUsers({
    searchQuery,
    filters,
    currentPage,
    pageSize,
  });
  usePrefetchTeams({
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
    teamType: 'Discovery Team',
  });
  usePrefetchTeams({
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
    teamType: 'Resource Team',
  });
  usePrefetchInterestGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });
  usePrefetchWorkingGroups({
    currentPage: 0,
    pageSize,
    searchQuery,
    filters: new Set(),
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  const isStaff = user?.role === 'Staff';

  const exportResults = isStaff
    ? () =>
        resultsToStream<UserListItemResponse>(
          createCsvFileStream(`People_${format(new Date(), 'MMddyy')}.csv`, {
            header: true,
          }),
          (paginationParams) =>
            getUsers(client, {
              filters,
              searchQuery,
              ...paginationParams,
            }),
          userToCSV,
          MAX_ALGOLIA_RESULTS,
        )
    : undefined;

  return (
    <NetworkPeople
      algoliaIndexName={result.algoliaIndexName}
      algoliaQueryId={result.algoliaQueryId}
      people={result.items}
      numberOfItems={result.total}
      numberOfPages={numberOfPages}
      currentPageIndex={currentPage}
      renderPageHref={renderPageHref}
      exportResults={exportResults}
    />
  );
};

export default UserList;
