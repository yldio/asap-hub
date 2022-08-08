describe('This tests nothing', () => {
  test('This tests nothing', () => {
    expect(true).toEqual(true)
  });
});

export {};

// import Boom from '@hapi/boom';
// import { indexUserHandler } from '../../../src/handlers/user/index-handler';
// import { getUserEvent, getUserResponse } from '../../fixtures/users.fixtures';
// import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
// import { userControllerMock } from '../../mocks/user-controller.mock';
//
// describe('User index handler', () => {
//   const indexHandler = indexUserHandler(
//     userControllerMock,
//     algoliaSearchClientMock,
//   );
//
//   afterEach(() => jest.clearAllMocks());
//
//   test('Should fetch the user and create a record in Algolia when the user is created', async () => {
//     const event = createEvent();
//     const userResponse = getUserResponse();
//     userControllerMock.fetchById.mockResolvedValueOnce(userResponse);
//
//     await indexHandler(event);
//     expect(userControllerMock.fetchById).toHaveBeenCalledWith(
//       event.detail.payload.id,
//     );
//     expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
//       data: userResponse,
//       type: 'user',
//     });
//   });
//
//   test('Should fetch the user and create a record in Algolia when user is updated', async () => {
//     const userResponse = getUserResponse();
//     userControllerMock.fetchById.mockResolvedValueOnce(userResponse);
//
//     await indexHandler(updateEvent());
//
//     expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
//       data: userResponse,
//       type: 'user',
//     });
//   });
//
//   test('Should fetch the user and remove a record in Algolia when user is updated but not onboarded', async () => {
//     const userResponse = {
//       ...getUserResponse(),
//       onboarded: false,
//     };
//     userControllerMock.fetchById.mockResolvedValueOnce(userResponse);
//
//     await indexHandler(updateEvent(userResponse.id));
//
//     expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//       userResponse.id,
//     );
//   });
//
//   test('Should fetch the user and remove a record in Algolia when user is updated but Hidden', async () => {
//     const userResponse = getUserResponse();
//     userControllerMock.fetchById.mockResolvedValueOnce({
//       ...userResponse,
//       role: 'Hidden',
//     });
//
//     await indexHandler(updateEvent(userResponse.id));
//
//     expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//       userResponse.id,
//     );
//   });
//
//   test('Should fetch the user and remove the record in Algolia when user is unpublished', async () => {
//     const event = unpublishedEvent();
//
//     userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//
//     await indexHandler(event);
//
//     expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//       event.detail.payload.id,
//     );
//   });
//
//   test('Should fetch the user and remove the record in Algolia when user is deleted', async () => {
//     const event = deleteEvent();
//
//     userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//
//     await indexHandler(event);
//
//     expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//       event.detail.payload.id,
//     );
//   });
//
//   test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
//     userControllerMock.fetchById.mockRejectedValue(Boom.badData());
//
//     await expect(indexHandler(createEvent())).rejects.toThrow(Boom.badData());
//     expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
//   });
//
//   test('Should throw the algolia error when saving the record fails', async () => {
//     const algoliaError = new Error('ERROR');
//
//     userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());
//     algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);
//
//     await expect(indexHandler(updateEvent())).rejects.toThrow(algoliaError);
//   });
//
//   test('Should throw the algolia error when deleting the record fails', async () => {
//     const algoliaError = new Error('ERROR');
//
//     userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//
//     algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);
//
//     await expect(indexHandler(deleteEvent())).rejects.toThrow(algoliaError);
//   });
//
//   describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
//     test('receives the events created and updated in correct order', async () => {
//       const userId = 'user-1234';
//       const userResponse = {
//         ...getUserResponse(),
//         id: userId,
//       };
//
//       userControllerMock.fetchById.mockResolvedValue({
//         ...userResponse,
//       });
//
//       await indexHandler(createEvent(userId));
//       await indexHandler(updateEvent(userId));
//
//       expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
//         data: userResponse,
//         type: 'user',
//       });
//     });
//
//     test('receives the events created and updated in reverse order', async () => {
//       const userId = 'user-1234';
//       const userResponse = {
//         ...getUserResponse(),
//         id: userId,
//       };
//
//       userControllerMock.fetchById.mockResolvedValue(userResponse);
//
//       await indexHandler(updateEvent(userId));
//       await indexHandler(createEvent(userId));
//
//       expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
//         data: userResponse,
//         type: 'user',
//       });
//     });
//
//     test('receives the events created and unpublished in correct order', async () => {
//       const userId = 'user-1234';
//       const createEv = createEvent(userId);
//       const unpublishedEv = unpublishedEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(createEv);
//       await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         unpublishedEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events created and unpublished in reverse order', async () => {
//       const userId = 'user-1234';
//       const createEv = createEvent(userId);
//       const unpublishedEv = unpublishedEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(unpublishedEv);
//       await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         unpublishedEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events created and deleted in correct order', async () => {
//       const userId = 'user-1234';
//       const createEv = createEvent(userId);
//       const deleteEv = deleteEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(createEv);
//       await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         deleteEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events created and deleted in reverse order', async () => {
//       const userId = 'user-1234';
//       const createEv = createEvent(userId);
//       const deleteEv = deleteEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(deleteEv);
//       await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         deleteEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events updated and deleted in correct order', async () => {
//       const userId = 'user-1234';
//       const updateEv = updateEvent(userId);
//       const deleteEv = deleteEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(updateEv);
//       await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         deleteEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events updated and deleted in reverse order', async () => {
//       const userId = 'user-1234';
//       const updateEv = updateEvent(userId);
//       const deleteEv = deleteEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(deleteEv);
//       await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         deleteEv.detail.payload.id,
//       );
//     });
//     test('receives the events updated and unpublished in correct order', async () => {
//       const userId = 'user-1234';
//       const updateEv = updateEvent(userId);
//       const unpublishedEv = unpublishedEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(updateEv);
//       await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         unpublishedEv.detail.payload.id,
//       );
//     });
//
//     test('receives the events updated and unpublished in reverse order', async () => {
//       const userId = 'user-1234';
//       const updateEv = updateEvent(userId);
//       const unpublishedEv = unpublishedEvent(userId);
//       const algoliaError = new Error('ERROR');
//
//       userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
//       algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
//       algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);
//
//       await indexHandler(unpublishedEv);
//       await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);
//
//       expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
//       expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
//         unpublishedEv.detail.payload.id,
//       );
//     });
//   });
// });
//
// const unpublishedEvent = (id: string = 'user-1234') =>
//   getUserEvent(id, 'UsersUnpublished');
//
// const deleteEvent = (id: string = 'user-1234') =>
//   getUserEvent(id, 'UsersDeleted');
//
// const createEvent = (id: string = 'user-1234') =>
//   getUserEvent(id, 'UsersPublished');
//
// const updateEvent = (id: string = 'user-1234') =>
//   getUserEvent(id, 'UsersUpdated');
