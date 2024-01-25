import UserController from '../../src/controllers/user.controller';
import { PublicInterface } from '../utils/types';

export const userControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByCode: jest.fn(),
  connectByCode: jest.fn(),
  update: jest.fn(),
  updateAvatar: jest.fn(),
  syncOrcidProfile: jest.fn(),
  createActiveCampaignContact: jest.fn(),
  updateActiveCampaignContact: jest.fn(),
} satisfies jest.Mocked<
  PublicInterface<UserController>
> as unknown as jest.Mocked<UserController>;
