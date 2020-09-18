import { CMSUser } from '../../../src/entities/user';

export const sendEmailsPayload: {
  type: string;
  payload: object;
  timestamp: string;
} = {
  type: 'Manual',
  payload: {
    $type: 'EnrichedManualEvent',
    partition: 0,
    actor: 'subject:5ef5d2fe75c5460001445b65',
    appId: '6608ad30-fdfe-4a8b-9ebf-70bb4732dd56,asap-hub',
    timestamp: '2020-09-21T15:57:08Z',
    name: 'Manual',
    version: 0,
  },
  timestamp: '2020-09-21T15:57:08Z',
};

export const fetchUsersResponse: { total: number; items: CMSUser[] } = {
  total: 3306,
  items: [
    {
      id: 'c0f30d2b-0750-4b8f-a70d-d8c4d762e3c8',
      data: {
        lastModifiedDate: {
          iv: '2020-09-09T09:10:06.984Z',
        },
        displayName: {
          iv: 'Bertha Zini',
        },
        email: {
          iv: 'ofe@nevkuf.dj',
        },
        skills: {
          iv: [],
        },
        orcidWorks: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-09T09:10:07Z',
      lastModified: '2020-09-09T09:10:07Z',
    },
    {
      id: 'faf6b265-9e73-489b-bb28-02df2bff5d7d',
      data: {
        lastModifiedDate: {
          iv: '2020-09-09T09:10:06.991Z',
        },
        displayName: {
          iv: 'Bettie Filippini',
        },
        email: {
          iv: 'kijubu@zip.com',
        },
        firstName: {
          iv: 'Steven',
        },
        middleName: {
          iv: 'Falcini',
        },
        lastName: {
          iv: 'Gauthier',
        },
        jobTitle: {
          iv: 'Doctor of Philosophy',
        },
        orcid: {
          iv: '190-95-6060',
        },
        institution: {
          iv: 'Burlington Northern Santa Fe Corporation',
        },
        location: {
          iv: 'Zarevde',
        },
        avatarURL: {
          iv: 'http://hoevete.hm/bihwawa',
        },
        skills: {
          iv: [],
        },
        orcidWorks: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-09T09:10:07Z',
      lastModified: '2020-09-09T09:10:07Z',
    },
    {
      id: '7d943237-c190-4a33-8088-3e4d76e7671d',
      data: {
        lastModifiedDate: {
          iv: '2020-09-09T09:10:09.415Z',
        },
        displayName: {
          iv: 'Mark Koek',
        },
        email: {
          iv: 'ojorog@bup.jp',
        },
        firstName: {
          iv: 'Donald',
        },
        middleName: {
          iv: 'Merino',
        },
        lastName: {
          iv: 'Walton',
        },
        jobTitle: {
          iv: 'Master of Arts',
        },
        orcid: {
          iv: '568-42-1269',
        },
        institution: {
          iv: 'Qualcomm Inc',
        },
        location: {
          iv: 'Ebnocoko',
        },
        avatarURL: {
          iv: 'http://ku.gn/wawi',
        },
        skills: {
          iv: [],
        },
        orcidWorks: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-09T09:10:09Z',
      lastModified: '2020-09-09T09:10:09Z',
    },
    {
      id: 'dd460536-2762-44a6-9254-50ed34284398',
      data: {
        lastModifiedDate: {
          iv: '2020-09-09T09:11:09.770Z',
        },
        displayName: {
          iv: 'Dale Thornton',
        },
        email: {
          iv: 'nadkifiv@ha.tf',
        },
        firstName: {
          iv: 'Addie',
        },
        middleName: {
          iv: 'Marino',
        },
        lastName: {
          iv: 'Palagi',
        },
        jobTitle: {
          iv: 'Bachelor of Technology',
        },
        orcid: {
          iv: '698-67-9611',
        },
        institution: {
          iv: 'R.J. Reynolds Tobacco Company',
        },
        location: {
          iv: 'Aroalawi',
        },
        avatarURL: {
          iv: 'http://enfi.ml/akupupobe',
        },
        skills: {
          iv: [],
        },
        orcidWorks: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
      },
      created: '2020-09-09T09:11:09Z',
      lastModified: '2020-09-09T09:11:09Z',
    },
    {
      id: '3d6e4966-e67a-427d-893d-f44c534f6d33',
      data: {
        lastModifiedDate: {
          iv: '2020-09-09T09:11:10.280Z',
        },
        displayName: {
          iv: 'Leona Nakajima',
        },
        email: {
          iv: 'kigdipe@ucfa.fi',
        },
        firstName: {
          iv: 'Tommy',
        },
        middleName: {
          iv: "Degl'Innocenti",
        },
        lastName: {
          iv: 'Le GallGall',
        },
        jobTitle: {
          iv: 'Master of Business Administration',
        },
        orcid: {
          iv: '075-63-6798',
        },
        institution: {
          iv: 'Dole Food Company, Inc.',
        },
        location: {
          iv: 'Gihwugaji',
        },
        avatarURL: {
          iv: 'http://waga.tc/jezejgo',
        },
        skills: {
          iv: [],
        },
        orcidWorks: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [
            {
              code: '427d-893d-f44c534f6d33',
            },
          ],
        },
      },
      created: '2020-09-09T09:11:10Z',
      lastModified: '2020-09-09T09:11:10Z',
    },
  ],
};
