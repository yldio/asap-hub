import { DiscoverResponse } from '@asap-hub/model';
import { useGetOne } from './get-one';

export const useDiscover = () => useGetOne<DiscoverResponse>(`discover`);
