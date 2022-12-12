import { gp2 } from '@asap-hub/model';
import { useHistory, useLocation } from 'react-router-dom';
import { usePaginationParams } from './pagination';

export const useSearch = (): {
  changeLocation: (pathname: string) => void;
  filters: gp2.FetchUsersFilter;
  updateFilters: (pathname: string, filters: gp2.FetchUsersFilter) => void;
} => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const selectedRegions = currentUrlParams.getAll('region') as gp2.UserRegion[];
  const selectedKeywords = currentUrlParams.getAll('keyword') as gp2.Keyword[];
  const selectedProjects = currentUrlParams.getAll('project');
  const selectedWorkingGroups = currentUrlParams.getAll('working-group');

  const updateParams = (search: string) => {
    const newUrlParams = new URLSearchParams(search);
    return {
      newUrlParams,
      updateParams: function update(name: string, items?: string[]) {
        newUrlParams.delete(name);
        items?.forEach((item) => newUrlParams.append(name, item));
        return this;
      },
    };
  };

  const updateFilters = (
    pathname: string,
    { regions, keywords, projects, workingGroups }: gp2.FetchUsersFilter,
  ) => {
    resetPagination();

    const { newUrlParams } = updateParams(history.location.search)
      .updateParams('region', regions)
      .updateParams('keyword', keywords)
      .updateParams('project', projects)
      .updateParams('working-group', workingGroups);

    history.push({ pathname, search: newUrlParams.toString() });
  };
  const changeLocation = (pathname: string) => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };

  const filters: gp2.FetchUsersFilter = {
    regions: selectedRegions,
    keywords: selectedKeywords,
    projects: selectedProjects,
    workingGroups: selectedWorkingGroups,
  };
  return {
    changeLocation,
    filters,
    updateFilters,
  };
};
