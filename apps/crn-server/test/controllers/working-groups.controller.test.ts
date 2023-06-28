import { NotFoundError } from '@asap-hub/errors';
import WorkingGroups from '../../src/controllers/working-groups.controller';
import {
  getWorkingGroupDataObject,
  getWorkingGroupResponse,
} from '../fixtures/working-groups.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Working Group controller', () => {
  const workingGroupDataProviderMock = getDataProviderMock();
  const workingGroupController = new WorkingGroups(
    workingGroupDataProviderMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the working groups', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getWorkingGroupDataObject()],
      });

      const result = await workingGroupController.fetch({});

      expect(result).toEqual({
        items: [getWorkingGroupDataObject()],
        total: 1,
      });
    });

    test('Should return an empty list when there are no working groups', async () => {
      workingGroupDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await workingGroupController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test.each`
      filter                    | filterValue
      ${['Active']}             | ${{ filter: { complete: false } }}
      ${['Complete']}           | ${{ filter: { complete: true } }}
      ${[]}                     | ${{}}
      ${['Active', 'Complete']} | ${{}}
    `(
      `Should call data provider with correct filter when filter is $filter`,
      async ({ filter, filterValue }) => {
        workingGroupDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [getWorkingGroupDataObject()],
        });

        await workingGroupController.fetch({ filter });

        expect(workingGroupDataProviderMock.fetch).toBeCalledWith(filterValue);
      },
    );
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when working-group is not found', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        workingGroupController.fetchById('not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should return the working-group when it finds it', async () => {
      workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupDataObject(),
      );
      const result = await workingGroupController.fetchById('group-id');

      expect(result).toEqual(getWorkingGroupResponse());
    });
  });
});
