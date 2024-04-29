//import { getuser} from "../../../../src/data-providers/contentful/analytics.data-provider";
export {};

/*describe('coproduction', () => {
  const data = getUserCoproductionAcrossTeams({
    total: 2,
    items: [
      {
        sys: {
          id: '1'
        },
        teamsCollection: {
          items: [
            {
              team: { sys: { id: 't1' }, displayName: 'Team 1' },
              role: 'Role 1',
              inactiveSinceDate: '',
            }
          ]
        },
        linkedFrom: {
          researchOutputsCollection: {
            items: [
              {
                sys: {
                  publishedAt: 'date1'
                },
                authorsCollection: {
                  items: [
                    {
                      __typename: "Users",
                      sys: { id: '1' },
                      teamsCollection: {
                        items: [
                          { sys: { id: 't1' } },
                        ]
                      }
                    },
                    {
                      __typename: "Users",
                      sys: { id: '2' },
                      teamsCollection: {
                        items: [
                          { sys: { id: 't2' } },
                          { sys: { id: 't3' } },
                        ]
                      }
                    },
                    {
                      __typename: "Users",
                      sys: { id: '3' },
                      teamsCollection: {
                        items: [
                          { sys: { id: 't1' } },
                          { sys: { id: 't2' } },
                          { sys: { id: 't3' } },
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    ]
  });
  console.log(data);
  expect(data).toBe(true);
});
*/