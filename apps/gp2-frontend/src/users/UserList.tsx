import { UsersPageBody, FiltersModal } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useSearch } from '../hooks/search';
import { useUsersState } from './state';

type UserListProps = {
  displayFilters?: boolean;
};

const UserList: React.FC<UserListProps> = ({ displayFilters = false }) => {
  const { users } = gp2;

  const { currentPage, pageSize } = usePaginationParams();
  const { filters, updateFilters, changeLocation } = useSearch();
  const userList = useUsersState({
    skip: currentPage * pageSize,
    take: pageSize,
    search: '',
    filter: filters,
  });
  const { numberOfPages, renderPageHref } = usePagination(
    userList.total,
    pageSize,
  );
  const backHref = users({}).$;
  const filtersHref = users({}).filters({}).$;
  const onBackClick = () => changeLocation(backHref);
  const onFiltersClick = () => changeLocation(filtersHref);

  return (
    <>
      <UsersPageBody
        users={userList}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
        onFiltersClick={onFiltersClick}
      />
      {displayFilters && (
        <FiltersModal
          onBackClick={onBackClick}
          filters={filters}
          onApplyClick={(f) => updateFilters(backHref, f)}
        />
      )}
    </>
  );
};
export default UserList;
