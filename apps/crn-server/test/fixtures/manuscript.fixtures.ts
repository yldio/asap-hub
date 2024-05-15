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

  ...props,
});

export const getManuscriptCreateDataObject = (): ManuscriptCreateDataObject => {
  const { title } = getManuscriptDataObject();

  return { title };
};
