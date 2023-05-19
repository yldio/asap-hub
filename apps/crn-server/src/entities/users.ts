import { OrcidWork, orcidWorkType, OrcidWorkType } from '@asap-hub/model';

export const isOrcidWorkType = (data: string): data is OrcidWorkType =>
  (orcidWorkType as ReadonlyArray<string>).includes(data);

export const getOrcidWorkPublicationDate = (
  input: Record<'day' | 'month' | 'year', string | undefined>,
): OrcidWork['publicationDate'] => {
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
