import { gp2 } from '@asap-hub/model';
import { useHistory, useLocation } from 'react-router-dom';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
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
    { region, keyword, project, workingGroup }: gp2.FetchUsersFilter,
  ) => {
    resetPagination();

    const { newUrlParams } = updateParams(history.location.search)
      .updateParams('region', region)
      .updateParams('keyword', keyword)
      .updateParams('project', project)
      .updateParams('working-group', workingGroup);

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
