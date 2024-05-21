import { FetchManuscriptByIdQuery } from '@asap-hub/contentful';
import {
  ManuscriptCreateDataObject,
  ManuscriptDataObject,
  ManuscriptResponse,
} from '@asap-hub/model';

export const getManuscriptDataObject = (
  data: Partial<ManuscriptDataObject> = {},
): ManuscriptDataObject => ({
  id: 'manuscript-id-1',
  title: 'Manuscript Title',
  teamId: 'team-1',
  ...data,
});

export const getManuscriptResponse = (
  data: Partial<ManuscriptDataObject> = {},
): ManuscriptResponse => getManuscriptDataObject(data) as ManuscriptResponse;

export const getContentfulGraphqlManuscripts = (
  props: Partial<
    NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']>
  > = {},
): NonNullable<NonNullable<FetchManuscriptByIdQuery>['manuscripts']> => ({
  sys: {
    id: 'manuscript-id-1',
  },
  title: 'Manuscript Title',
  teamsCollection: {
    items: [{ sys: { id: 'team-1' } }],
  },
  ...props,
});

export const getManuscriptCreateDataObject = (): ManuscriptCreateDataObject => {
  const { title, teamId } = getManuscriptDataObject();

  return { title, teamId };
};
