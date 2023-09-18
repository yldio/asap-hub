import {
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  EventNotesReminder,
  ListReminderDataObject,
  ListReminderResponse,
  PresentationUpdatedReminder,
  PublishMaterialReminder,
  ReminderEventResponse,
  ReminderResponse,
  ResearchOutputDraftReminder,
  ResearchOutputInReviewReminder,
  ResearchOutputPublishedReminder,
  ResearchOutputSwitchToDraftReminder,
  ResearchOutputVersionPublishedReminder,
  SharePresentationReminder,
  UploadPresentationReminder,
  VideoEventReminder,
} from '@asap-hub/model';
import {
  FetchRemindersQuery,
  FetchTeamProjectManagerQuery,
} from '@asap-hub/contentful';
import { getContentfulGraphqlEvent, getEventResponse } from './events.fixtures';
import {
  getContentfulResearchOutputGraphqlResponse,
  getResearchOutputDataObject,
} from './research-output.fixtures';

export const getResearchOutputVersionPublishedReminder =
  (): ResearchOutputVersionPublishedReminder => {
    return {
      id: 'research-output-version-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output Version',
      type: 'Published',
      data: {
        researchOutputId: 'research-output-1',
        documentType: 'Bioinformatics',
        title: 'test-research-output-version',
        publishedAt: '2023-01-01T08:00:00Z',
        associationType: 'team',
        associationName: 'Team A',
      },
    };
  };

export const getResearchOutputPublishedReminder =
  (): ResearchOutputPublishedReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'Published',
      data: {
        researchOutputId: researchOutputDataObject.id,
        documentType: researchOutputDataObject.documentType,
        title: researchOutputDataObject.title,
        addedDate: researchOutputDataObject.addedDate,
        statusChangedBy: 'Tom Hardy',
        associationType: 'team',
        associationName: 'Team A',
      },
    };
  };

export const getResearchOutputDraftTeamReminder =
  (): ResearchOutputDraftReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-draft-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'Draft',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        createdDate: researchOutputDataObject.created,
        associationName: researchOutputDataObject.teams[0]?.displayName || '',
        associationType: 'team',
        createdBy: 'Tom Hardy',
      },
    };
  };

export const getResearchOutputDraftWorkingGroupReminder =
  (): ResearchOutputDraftReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-draft-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'Draft',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        createdDate: researchOutputDataObject.created,
        associationName: 'Working Group 1',
        associationType: 'working group',
        createdBy: 'Tom Hardy',
      },
    };
  };

export const getResearchOutputInReviewTeamReminder =
  (): ResearchOutputInReviewReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-in-review-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'In Review',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        createdDate: researchOutputDataObject.created,
        associationName: researchOutputDataObject.teams[0]?.displayName || '',
        associationType: 'team',
        documentType: researchOutputDataObject.documentType,
        statusChangedBy: 'Tom Hardy',
      },
    };
  };

export const getResearchOutputInReviewWorkingGroupReminder =
  (): ResearchOutputInReviewReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-in-review-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'In Review',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        createdDate: researchOutputDataObject.created,
        associationName: 'Working Group 1',
        associationType: 'working group',
        documentType: researchOutputDataObject.documentType,
        statusChangedBy: 'Tom Hardy',
      },
    };
  };

export const getEventHappeningTodayReminder =
  (): EventHappeningTodayReminder => {
    const eventResponse = getEventResponse();
    return {
      id: `event-happening-today-${eventResponse.id}`,
      entity: 'Event',
      type: 'Happening Today',
      data: {
        eventId: eventResponse.id,
        startDate: eventResponse.startDate,
        title: eventResponse.title,
      },
    };
  };

export const getEventHappeningNowReminder = (): EventHappeningNowReminder => {
  const eventResponse = getEventResponse();
  return {
    id: `event-happening-now-${eventResponse.id}`,
    entity: 'Event',
    type: 'Happening Now',
    data: {
      eventId: eventResponse.id,
      startDate: eventResponse.startDate,
      endDate: eventResponse.endDate,
      title: eventResponse.title,
    },
  };
};

export const getSharePresentationReminder = (): SharePresentationReminder => {
  const eventResponse = getEventResponse();
  return {
    id: `share-presentation-${eventResponse.id}`,
    entity: 'Event',
    type: 'Share Presentation',
    data: {
      eventId: eventResponse.id,
      title: eventResponse.title,
      endDate: eventResponse.endDate,
    },
  };
};

export const getUploadPresentationReminder = (): UploadPresentationReminder => {
  const eventResponse = getEventResponse();
  return {
    id: `upload-presentation-${eventResponse.id}`,
    entity: 'Event',
    type: 'Upload Presentation',
    data: {
      eventId: eventResponse.id,
      title: eventResponse.title,
      endDate: eventResponse.endDate,
    },
  };
};

export const getPublishMaterialReminder = (): PublishMaterialReminder => {
  const eventResponse = getEventResponse();
  return {
    id: `publish-material-${eventResponse.id}`,
    entity: 'Event',
    type: 'Publish Material',
    data: {
      eventId: eventResponse.id,
      title: eventResponse.title,
      endDate: eventResponse.endDate,
    },
  };
};

export const getVideoEventUpdatedReminder = (): VideoEventReminder => {
  const eventResponse = getEventResponse() as ReminderEventResponse;
  eventResponse.videoRecordingUpdatedAt = '2010-08-01T08:00:04.000Z';

  return {
    id: `video-event-updated-${eventResponse.id}`,
    entity: 'Event',
    type: 'Video Updated',
    data: {
      eventId: eventResponse.id,
      title: eventResponse.title,
      videoRecordingUpdatedAt: eventResponse.videoRecordingUpdatedAt,
    },
  };
};

export const getPresentationUpdatedReminder =
  (): PresentationUpdatedReminder => {
    const eventResponse = getEventResponse() as ReminderEventResponse;
    eventResponse.presentationUpdatedAt = '2010-08-01T08:00:04.000Z';

    return {
      id: `presentation-event-updated-${eventResponse.id}`,
      entity: 'Event',
      type: 'Presentation Updated',
      data: {
        eventId: eventResponse.id,
        title: eventResponse.title,
        presentationUpdatedAt: eventResponse.presentationUpdatedAt,
      },
    };
  };

export const getNotesUpdatedReminder = (): EventNotesReminder => {
  const eventResponse = getEventResponse() as ReminderEventResponse;
  eventResponse.notesUpdatedAt = '2010-08-01T08:00:04.000Z';

  return {
    id: `notes-event-updated-${eventResponse.id}`,
    entity: 'Event',
    type: 'Notes Updated',
    data: {
      eventId: eventResponse.id,
      title: eventResponse.title,
      notesUpdatedAt: eventResponse.notesUpdatedAt,
    },
  };
};

export const getListReminderDataObject = (): ListReminderDataObject => ({
  total: 1,
  items: [getResearchOutputPublishedReminder()],
});

export const getReminderResponse = (): ReminderResponse => {
  return {
    id: 'research-output-published-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    description:
      '**Tom Hardy** on team **Team A** published a team Bioinformatics output: Test Proposal 1234.',
    entity: 'Research Output',
    href: '/shared-research/ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  };
};

export const getListReminderResponse = (): ListReminderResponse => ({
  total: 1,
  items: [getReminderResponse()],
});

export const getContentfulReminderEventsCollectionItem = (): NonNullable<
  FetchRemindersQuery['eventsCollection']
>['items'][number] => {
  const event = getContentfulGraphqlEvent();

  return {
    sys: {
      id: event.sys.id,
    },
    startDate: event.startDate,
    endDate: event.endDate,
    title: event.title,
    videoRecordingUpdatedAt: event.videoRecordingUpdatedAt,
    presentationUpdatedAt: event.presentationUpdatedAt,
    notesUpdatedAt: event.notesUpdatedAt,
    speakersCollection: {
      items: [
        {
          team: {
            sys: {
              id: 'team-1',
            },
          },
        },
      ],
    },
  };
};

export const getContentfulReminderResearchOutputCollectionItem =
  (): NonNullable<
    FetchRemindersQuery['researchOutputsCollection']
  >['items'][number] => {
    const researchOutput = getContentfulResearchOutputGraphqlResponse();

    return {
      sys: {
        id: researchOutput.sys.id,
        publishedAt: researchOutput.createdDate,
      },
      addedDate: researchOutput.addedDate,
      createdDate: researchOutput.createdDate,
      documentType: researchOutput.documentType,
      title: researchOutput.title,
      createdBy: {
        sys: {
          id: 'user-1',
        },
        firstName: 'Tom',
        lastName: 'Hardy',
      },
      teamsCollection: {
        items: [
          {
            sys: {
              id: 'team-1',
            },
            displayName: 'Team A',
          },
        ],
      },
      workingGroup: {
        sys: {
          id: 'wg-id-1',
        },
        title: 'Working Group 1',
      },
      statusChangedBy: {
        sys: {
          id: 'user-1',
        },
        firstName: 'Tom',
        lastName: 'Hardy',
      },
      isInReview: false,
    };
  };

export const getContentfulReminderResearchOutputVersionCollectionItem =
  (): NonNullable<
    FetchRemindersQuery['researchOutputVersionsCollection']
  >['items'][number] => {
    return {
      sys: {
        id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
        publishedAt: '2020-09-23T16:34:26.842Z',
      },
      linkedFrom: {
        researchOutputsCollection: {
          items: [
            {
              title: 'test-research-output-version',
              documentType: 'Bioinformatics',
              sys: {
                id: 'research-output-1',
              },
              teamsCollection: {
                items: [
                  {
                    sys: {
                      id: 'team-1',
                    },
                    displayName: 'Team A',
                  },
                ],
              },
              workingGroup: {
                sys: {
                  id: 'wg-id-1',
                },
                title: 'Working Group 1',
              },
            },
          ],
        },
      },
    };
  };

export const getContentfulReminderUsersContent =
  (): FetchRemindersQuery['users'] => {
    const eventResponse = getEventResponse();

    return {
      role: 'Grantee',
      teamsCollection: {
        items: [
          {
            role: 'Collaborating PI',
            team: {
              sys: {
                id: 'team-1',
              },
            },
          },
        ],
      },
      linkedFrom: {
        workingGroupMembersCollection: {
          items: [
            {
              linkedFrom: {
                workingGroupsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'wg-id-1',
                      },
                      title: 'Working Group 1',
                    },
                  ],
                },
              },
            },
          ],
        },
        workingGroupLeadersCollection: {
          items: [
            {
              role: 'Project Manager',
              linkedFrom: {
                workingGroupsCollection: {
                  items: [
                    {
                      sys: {
                        id: 'wg-id-2',
                      },
                      title: 'Working Group 2',
                    },
                  ],
                },
              },
            },
          ],
        },
        eventSpeakersCollection: {
          items: [
            {
              team: {
                sys: {
                  id: 'team-1',
                },
              },
              linkedFrom: {
                eventsCollection: {
                  items: [
                    {
                      sys: {
                        id: eventResponse.id,
                      },
                      title: eventResponse.title,
                      endDate: eventResponse.endDate,
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    };
  };

export const getTeamProjectManagerResponse =
  (): FetchTeamProjectManagerQuery => ({
    teamMembershipCollection: {
      items: [
        {
          linkedFrom: {
            usersCollection: {
              total: 1,
              items: [
                {
                  sys: {
                    id: 'project-manager-1',
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

export const getResearchOutputSwitchToDraftTeamReminder =
  (): ResearchOutputSwitchToDraftReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-switch-to-draft-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'Switch To Draft',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        statusChangedAt: '2021-05-21T13:18:31Z',
        associationName: researchOutputDataObject.teams[0]?.displayName || '',
        associationType: 'team',
        documentType: researchOutputDataObject.documentType,
        statusChangedBy: 'Tom Hardy',
      },
    };
  };
export const getResearchOutputSwitchToDraftWorkingGroupReminder =
  (): ResearchOutputSwitchToDraftReminder => {
    const researchOutputDataObject = getResearchOutputDataObject();
    return {
      id: 'research-output-switch-to-draft-ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      entity: 'Research Output',
      type: 'Switch To Draft',
      data: {
        researchOutputId: researchOutputDataObject.id,
        title: researchOutputDataObject.title,
        statusChangedAt: '2021-05-21T13:18:31Z',
        associationName: 'Working Group 1',
        associationType: 'working group',
        documentType: researchOutputDataObject.documentType,
        statusChangedBy: 'Tom Hardy',
      },
    };
  };
