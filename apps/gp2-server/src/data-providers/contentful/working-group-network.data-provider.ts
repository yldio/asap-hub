import { gp2 as gp2Contentful, GraphQLClient } from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { WorkingGroupNetworkDataProvider } from '../types';
import {
  GraphQLWorkingGroup,
  parseWorkingGroupToDataObject,
} from './working-group.data-provider';

const { workingGroupNetworkRole } = gp2Model;
export class WorkingGroupNetworkContentfulDataProvider
  implements WorkingGroupNetworkDataProvider
{
  constructor(private graphQLClient: GraphQLClient) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
  async fetch() {
    const { workingGroupNetworkCollection: networks } =
      await this.graphQLClient.request<
        gp2Contentful.FetchWorkingGroupNetworkQuery,
        gp2Contentful.FetchWorkingGroupNetworkQueryVariables
      >(gp2Contentful.FETCH_WORKING_GROUP_NETWORK);

    if (!networks?.items) {
      return {
        items: [],
        total: 0,
      };
    }
    const workingGroupNetwork = networks.items.filter(
      (network): network is GraphQLWorkingGroupNetwork => network !== null,
    )[0];
    if (!workingGroupNetwork) {
      return {
        items: [],
        total: 0,
      };
    }
    const items = parseWorkingGroupNetworkToDataObject(workingGroupNetwork);
    return {
      items,
      total: items.length,
    };
  }
}

export type GraphQLWorkingGroupNetwork = NonNullable<
  NonNullable<gp2Contentful.FetchWorkingGroupNetworkQuery>['workingGroupNetworkCollection']
>['items'][number];

export function parseWorkingGroupNetworkToDataObject(
  network: NonNullable<GraphQLWorkingGroupNetwork>,
): gp2Model.WorkingGroupNetworkDataObject[] {
  return workingGroupNetworkRole.map((role) => ({
    role,
    workingGroups:
      network[`${role}Collection`]?.items
        .filter(
          (workingGroup): workingGroup is GraphQLWorkingGroup =>
            workingGroup !== null,
        )
        .map(parseWorkingGroupToDataObject) || [],
  }));
}
