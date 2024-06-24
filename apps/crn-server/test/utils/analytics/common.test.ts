import { DocumentCategoryOption, TimeRangeOption } from '@asap-hub/model';
import {
  getFilterOutputByDocumentCategory,
  getFilterOutputByRange,
} from '../../../src/utils/analytics/common';

describe('filtering', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  describe('getFilterOutputByRange', () => {
    it.each<{
      key?: TimeRangeOption;
      inRange: string;
      out: string;
    }>([
      {
        inRange: '2023-09-05T03:00:00.000Z',
        out: '2023-08-05T03:00:00.000Z',
      },
      {
        key: '30d',
        inRange: '2023-09-05T03:00:00.000Z',
        out: '2023-08-05T03:00:00.000Z',
      },
      {
        key: '90d',
        inRange: '2023-08-05T03:00:00.000Z',
        out: '2023-06-05T03:00:00.000Z',
      },
      {
        key: 'current-year',
        inRange: '2023-09-10T03:00:00.000Z',
        out: '2022-12-31T03:00:00.000Z',
      },
      {
        key: 'last-year',
        inRange: '2022-09-10T03:00:00.000Z',
        out: '2022-09-09T03:00:00.000Z',
      },
    ])('filters outputs for time range $key', ({ key, inRange, out }) => {
      const items = [{ addedDate: inRange }, { addedDate: out }];

      expect(items.filter(getFilterOutputByRange(key)).length).toBe(1);
    });
    it('does not filter when rangeKey is "all"', () => {
      const items = [
        { addedDate: '1980-09-10T03:00:00.000Z' },
        { addedDate: '2022-09-10T03:00:00.000Z' },
        { addedDate: '2040-09-10T03:00:00.000Z' },
      ];

      expect(items.filter(getFilterOutputByRange('all')).length).toBe(3);
    });
    it('filter by createdDate when addedDate is null', () => {
      const items = [
        { addedDate: '2023-09-05T03:00:00.000Z' },
        { addedDate: null, createdDate: '2023-09-01T03:00:00.000Z' },
        { addedDate: '2023-09-09T03:00:00.000Z' },
      ];

      expect(items.filter(getFilterOutputByRange('30d')).length).toBe(3);
    });
  });

  describe('getFilterOutputByDocumentCategory', () => {
    it.each<{
      key?: DocumentCategoryOption;
      included: string;
      excluded: string;
    }>([
      {
        key: 'article',
        included: 'Article',
        excluded: 'Bioinformatics',
      },
      {
        key: 'bioinformatics',
        included: 'Bioinformatics',
        excluded: 'Dataset',
      },
      {
        key: 'dataset',
        included: 'Dataset',
        excluded: 'Lab Resource',
      },
      {
        key: 'lab-resource',
        included: 'Lab Resource',
        excluded: 'Protocol',
      },
      {
        key: 'protocol',
        included: 'Protocol',
        excluded: 'article',
      },
    ])(
      'filters outputs for document category $key',
      ({ key, included, excluded }) => {
        const items = [{ documentType: included }, { documentType: excluded }];

        expect(
          items.filter(getFilterOutputByDocumentCategory(key)).length,
        ).toBe(1);
      },
    );

    it('does not filter when document category key is "all"', () => {
      const items = [
        { documentType: 'Article' },
        { documentType: 'Bioinformatics' },
        { documentType: 'Dataset' },
        { documentType: 'Lab Resource' },
        { documentType: 'Protocol' },
      ];

      expect(
        items.filter(getFilterOutputByDocumentCategory('all')).length,
      ).toBe(5);
    });
  });
});
