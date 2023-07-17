import type { gp2 as gp2Contentful } from '@asap-hub/contentful';
import type { gp2 as gp2Model } from '@asap-hub/model';
import {
  getContentfulGraphqlWorkingGroup,
  getWorkingGroupDataObject,
} from './working-group.fixtures';

export const getWorkingGroupNetworkDataObject =
  (): gp2Model.WorkingGroupNetworkDataObject[] => [
    {
      role: 'operational',
      workingGroups: [getWorkingGroupDataObject()],
    },
    {
      role: 'monogenic',
      workingGroups: [getWorkingGroupDataObject()],
    },
    {
      role: 'complexDisease',
      workingGroups: [getWorkingGroupDataObject()],
    },
    {
      role: 'support',
      workingGroups: [getWorkingGroupDataObject()],
    },
  ];

export const getListWorkingGroupNetworkDataObject =
  (): gp2Model.ListWorkingGroupNetworkResponse => ({
    total: 4,
    items: getWorkingGroupNetworkDataObject(),
  });

export const getListWorkingGroupNetworkResponse =
  (): gp2Model.ListWorkingGroupNetworkResponse => ({
    total: 4,
    items: getWorkingGroupNetworkDataObject(),
  });

export const getContentfulGraphqlWorkingGroupNetwork = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchWorkingGroupNetworkQuery['workingGroupNetworkCollection']
  >
>['items'][number] => {
  const workingGroup = getContentfulGraphqlWorkingGroup();
  return {
    supportCollection: {
      total: 1,
      items: [{ ...workingGroup }],
    },
    complexDiseaseCollection: {
      total: 1,
      items: [{ ...workingGroup }],
    },
    operationalCollection: {
      total: 1,
      items: [{ ...workingGroup }],
    },
    monogenicCollection: {
      total: 1,
      items: [{ ...workingGroup }],
    },
  };
};

export const getContentfulGraphqlWorkingGroupNetworkResponse =
  (): gp2Contentful.FetchWorkingGroupNetworkQuery => ({
    workingGroupNetworkCollection: {
      total: 1,
      items: [getContentfulGraphqlWorkingGroupNetwork()],
    },
  });
