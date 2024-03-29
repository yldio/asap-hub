import {
  addLocaleToFields,
  Environment,
  getLinkEntities,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';
import { getIdsToDelete } from './common';

type ResourcesItem =
  | GraphQLWorkingGroup['resourcesCollection']
  | GraphQLProject['resourcesCollection'];

type ResourceItem = NonNullable<NonNullable<ResourcesItem>['items'][number]>;
export const parseResources = (
  resources:
    | GraphQLWorkingGroup['resourcesCollection']
    | GraphQLProject['resourcesCollection'],
): gp2Model.Resource[] =>
  resources?.items
    .filter((resource): resource is ResourceItem => resource !== null)
    .map((resource) => ({
      id: resource.sys.id,
      title: resource.title ?? '',
      description: resource.description ?? undefined,
      ...(resource.type === 'Note'
        ? { type: 'Note' }
        : {
            type: 'Link',
            externalLink: resource.externalLink ?? '',
          }),
    })) || [];

const addNextResources = async (
  environment: Environment,
  resources: gp2Model.Resource[] | undefined,
): Promise<string[]> => {
  const nextResources = resources?.filter((resource) => !resource.id);
  if (!nextResources?.length) {
    return [];
  }
  return Promise.all(
    nextResources.map(async (resource) => {
      const entry = await environment.createEntry('resources', {
        fields: addLocaleToFields({
          type: resource.type,
          title: resource.title,
          description: resource.description,
          externalLink: gp2Model.isResourceLink(resource)
            ? resource.externalLink
            : undefined,
        }),
      });
      await entry.publish();
      return entry.sys.id;
    }),
  );
};
const getResourceFields = (nextResources: string[]) => ({
  resources: getLinkEntities(nextResources, false),
});

type ResourceWithId = gp2Model.Resource & {
  id: string;
};
const updateResources = async (
  resources: gp2Model.Resource[] | undefined,
  idsToDelete: string[],
  previousResources: gp2Model.Resource[] | undefined,
  environment: Environment,
): Promise<string[]> => {
  const toUpdate = (resources || []).filter(
    (resource): resource is ResourceWithId =>
      !!resource.id && !idsToDelete.includes(resource.id),
  );
  await Promise.all(
    toUpdate
      .filter(outUnchangedResources(previousResources))
      .map(async ({ id, ...resource }) => {
        const updatable = await environment.getEntry(id);
        return patchAndPublish(updatable, { ...resource });
      }),
  );
  return toUpdate.map(({ id }) => id);
};

const outUnchangedResources =
  (previousResources: gp2Model.Resource[] | undefined) =>
  (resource: gp2Model.Resource) => {
    const previousResource = previousResources?.filter(
      (previous) => previous.id === resource.id,
    );
    return !(
      previousResource?.[0]?.type === resource.type &&
      previousResource[0].title === resource.title &&
      previousResource[0].description === resource.description &&
      (gp2Model.isResourceLink(previousResource[0]) &&
        previousResource[0].externalLink) ===
        (gp2Model.isResourceLink(resource) && resource.externalLink)
    );
  };

export const processResources = async (
  environment: Environment,
  resources: gp2Model.Resource[] | undefined,
  previousResources: gp2Model.Resource[] | undefined,
) => {
  const nextResources: string[] = await addNextResources(
    environment,
    resources,
  );

  const idsToDelete = getIdsToDelete(previousResources, resources);
  const updatedIds = await updateResources(
    resources,
    idsToDelete,
    previousResources,
    environment,
  );

  const fields = getResourceFields([...nextResources, ...updatedIds]);
  return { fields, idsToDelete };
};
