import { UsersPageBody, FiltersModal } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import { Route } from 'react-router-dom';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useSearch } from '../hooks/search';
import { useUsersState } from './state';

const UserList: React.FC<Record<string, never>> = () => {
  const { users } = gp2;

  const { currentPage, pageSize } = usePaginationParams();
  const { filters, updateFilters, searchQuery, changeLocation } = useSearch();
  const userList = useUsersState({
    currentPage,
    pageSize,
    searchQuery: '',
    filters: new Set(),
  });
  const { numberOfPages, renderPageHref } = usePagination(
    userList.total,
    pageSize,
  );
  const backHref = users({}).$;
  const filtersHref = users({}).filters({}).$;
  const onBackClick = () => changeLocation(backHref);
  const onFiltersClick = () => changeLocation(filtersHref);
  console.log(searchQuery);
  console.log('filters', filters);
  return (
    <>
      <UsersPageBody
        users={userList}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
        onFiltersClick={onFiltersClick}
      />
      <Route exact path={filtersHref}>
        <FiltersModal
          onBackClick={onBackClick}
          filters={filters}
          onApplyClick={(f) => updateFilters(backHref, f)}
        />
      </Route>
    </>
  );
};
export default UserList;
