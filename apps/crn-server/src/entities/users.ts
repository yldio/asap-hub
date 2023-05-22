import { OrcidWork, orcidWorkType, OrcidWorkType } from '@asap-hub/model';

export const isOrcidWorkType = (data: string): data is OrcidWorkType =>
  (orcidWorkType as ReadonlyArray<string>).includes(data);

export const getOrcidWorkPublicationDate = (input: {
  day?: string;
  month?: string;
  year?: string;
}): OrcidWork['publicationDate'] => {
  const date: OrcidWork['publicationDate'] = {};

  if (typeof input.day === 'string') {
    date.day = input.day;
  }

  if (typeof input.month === 'string') {
    date.month = input.month;
  }

  if (typeof input.year === 'string') {
    date.year = input.year;
  }

  return date;
};

type OrcidWorkCMS = {
  id: string;
  doi?: string;
  title?: string;
  type?: string;
  publicationDate?: {
    day?: string;
    month?: string;
    year?: string;
  };
  lastModifiedDate?: string;
};

export const parseOrcidWorkFromCMS = (orcidWork: OrcidWorkCMS): OrcidWork => ({
  id: orcidWork.id,
  doi: orcidWork.doi || undefined,
  title: orcidWork.title || undefined,
  type:
    orcidWork.type && isOrcidWorkType(orcidWork.type)
      ? orcidWork.type
      : 'UNDEFINED',
  publicationDate:
    (orcidWork.publicationDate &&
      getOrcidWorkPublicationDate(orcidWork.publicationDate)) ||
    {},
  lastModifiedDate: orcidWork.lastModifiedDate || '',
});
