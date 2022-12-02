import { useHistory, useLocation } from 'react-router-dom';
import { gp2 } from '@asap-hub/model';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const selectedRegions = currentUrlParams.getAll('region') as gp2.UserRegion[];
  const selectedKeywords = currentUrlParams.getAll('keyword') as gp2.Keyword[];
  const selectedProjects = currentUrlParams.getAll('project');
  const selectedWorkingGroups = currentUrlParams.getAll('working-group');

  const updateParams = (
    name: string,
    newUrlParams: URLSearchParams,
    items?: string[],
  ) => {
    newUrlParams.delete(name);
    items?.forEach((item) => newUrlParams.append(name, item));
  };

  const updateFilters = (
    pathname: string,
    { region, keyword, project, workingGroup }: gp2.FetchUsersFilter,
  ) => {
    resetPagination();
    const newUrlParams = new URLSearchParams(history.location.search);
    updateParams('region', newUrlParams, region);
    updateParams('keyword', newUrlParams, keyword);
    updateParams('project', newUrlParams, project);
    updateParams('working-group', newUrlParams, workingGroup);

    history.push({ pathname, search: newUrlParams.toString() });
  };
  const changeLocation = (pathname: string) => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };

  const filters = {
    region: selectedRegions,
    keyword: selectedKeywords,
    project: selectedProjects,
    workingGroup: selectedWorkingGroups,
  };
  return {
    changeLocation,
    filters,
    updateFilters,
  };
};
