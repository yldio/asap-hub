import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import AnalyticsController from '../../src/controllers/analytics.controller';
import {
  getListAnalyticsTeamLeadershipDataObject,
  getListAnalyticsTeamLeadershipResponse,
  getListTeamCollaborationResponse,
  getListTeamProductivityDataObject,
  getListTeamProductivityResponse,
  getListUserCollaborationResponse,
  getListUserProductivityDataObject,
  getListUserProductivityResponse,
} from '../fixtures/analytics.fixtures';
import { analyticsDataProviderMock } from '../mocks/analytics.data-provider.mock';

describe('Analytics controller', () => {
  const analyticsController = new AnalyticsController(
    analyticsDataProviderMock,
  );

  describe('fetchTeamLeadership method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchTeamLeadership.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchTeamLeadership({});

      expect(result).toEqual({
        total: 0,
        items: [],
      } satisfies ListAnalyticsTeamLeadershipResponse);
    });

    test('Should return the analytics team leadership', async () => {
      analyticsDataProviderMock.fetchTeamLeadership.mockResolvedValue(
        getListAnalyticsTeamLeadershipDataObject(),
      );

      const result = await analyticsController.fetchTeamLeadership({});

      expect(result).toEqual(getListAnalyticsTeamLeadershipResponse());
    });

    test('Should call the data provider with the correct options', async () => {
      const options: FetchPaginationOptions = {
        take: 10,
        skip: 5,
      };
      await analyticsController.fetchTeamLeadership(options);

      expect(
        analyticsDataProviderMock.fetchTeamLeadership,
      ).toHaveBeenCalledWith(options);
    });
  });

  describe('fetchUserProductivity method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchUserProductivity.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchUserProductivity({});

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the productivity data', async () => {
      analyticsDataProviderMock.fetchUserProductivity.mockResolvedValue(
        getListUserProductivityDataObject(),
      );

      const result = await analyticsController.fetchUserProductivity({});

      expect(result).toEqual(getListUserProductivityResponse());
    });

    test('Should call the data provider with the correct options', async () => {
      const options: FetchPaginationOptions = {
        take: 10,
        skip: 5,
      };
      await analyticsController.fetchUserProductivity(options);

      expect(
        analyticsDataProviderMock.fetchUserProductivity,
      ).toHaveBeenCalledWith(options);
    });
  });

  describe('fetchTeamProductivity method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchTeamProductivity.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchTeamProductivity({});

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the productivity data', async () => {
      analyticsDataProviderMock.fetchTeamProductivity.mockResolvedValue(
        getListTeamProductivityDataObject(),
      );

      const result = await analyticsController.fetchTeamProductivity({});

      expect(result).toEqual(getListTeamProductivityResponse());
    });

    test('Should call the data provider with the correct options', async () => {
      const options: FetchPaginationOptions = {
        take: 10,
        skip: 5,
      };
      await analyticsController.fetchTeamProductivity(options);

      expect(
        analyticsDataProviderMock.fetchTeamProductivity,
      ).toHaveBeenCalledWith(options);
    });
  });

  describe('fetchUserCollaboration method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchUserCollaboration.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchUserCollaboration({});

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the collaboration data', async () => {
      analyticsDataProviderMock.fetchUserCollaboration.mockResolvedValue(
        getListUserCollaborationResponse(),
      );

      const result = await analyticsController.fetchUserCollaboration({});

      expect(result).toEqual(getListUserCollaborationResponse());
    });

    test('Should call the data provider with the correct options', async () => {
      const options: FetchPaginationOptions = {
        take: 10,
        skip: 5,
      };
      await analyticsController.fetchUserCollaboration(options);

      expect(
        analyticsDataProviderMock.fetchUserCollaboration,
      ).toHaveBeenCalledWith(options);
    });
  });

  describe('fetchTeamCollaboration method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchTeamCollaboration.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchTeamCollaboration({});

      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return the team collaboration data', async () => {
      analyticsDataProviderMock.fetchTeamCollaboration.mockResolvedValue(
        getListTeamCollaborationResponse(),
      );

      const result = await analyticsController.fetchTeamCollaboration({});

      expect(result).toEqual(getListTeamCollaborationResponse());
    });

    test('Should call the data provider with the correct options', async () => {
      const options: FetchPaginationOptions = {
        take: 10,
        skip: 5,
      };
      await analyticsController.fetchTeamCollaboration(options);

      expect(
        analyticsDataProviderMock.fetchTeamCollaboration,
      ).toHaveBeenCalledWith(options);
    });
  });
});
