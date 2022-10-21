import { useHistory, useLocation } from 'react-router-dom';
import { gp2 } from '@asap-hub/model';
import { usePaginationParams } from './pagination';

export const useSearch = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const selectedRegions = currentUrlParams.getAll('region') as gp2.UserRegion[];

  const updateRegions = (
    newUrlParams: URLSearchParams,
    regions?: gp2.UserRegion[],
  ) => {
    newUrlParams.delete('region');
    regions?.forEach((region) => newUrlParams.append('region', region));
  };

  const updateFilters = (
    pathname: string,
    { region }: gp2.FetchUsersFilter,
  ) => {
    resetPagination();
    const newUrlParams = new URLSearchParams(history.location.search);
    updateRegions(newUrlParams, region);

    history.push({ pathname, search: newUrlParams.toString() });
  };
  const changeLocation = (pathname: string) => {
    history.push({ pathname, search: currentUrlParams.toString() });
  };

  return {
    changeLocation,
    filters: { region: selectedRegions },
    updateFilters,
  };
};
