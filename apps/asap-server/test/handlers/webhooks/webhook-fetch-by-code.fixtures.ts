import { CMSUser } from '../../../src/entities/user';

export const fetchUserResponse: { total: number; items: CMSUser[] } = {
  total: 1,
  items: [
    {
      id: '57d80949-7a75-462d-b3b0-34173423c490',
      data: {
        role: { iv: 'Grantee' },
        email: { iv: 'panog@ep.bv' },
        displayName: { iv: 'Peter Sharp' },
        skills: { iv: [] },
        lastModifiedDate: {
          iv: '2020-09-02T10:34:13.259Z',
        },
        orcid: { iv: '0000-0001-9884-1913' },
        orcidWorks: { iv: [] },
        teams: { iv: [] },
        connections: {
          iv: [{ code: '22f012ba-a059-4673-b052-c097cddff13f' }],
        },
      },
      created: '2020-08-27T13:20:57Z',
      lastModified: '2020-08-31T13:57:51Z',
    },
  ],
};

export default fetchUserResponse;
