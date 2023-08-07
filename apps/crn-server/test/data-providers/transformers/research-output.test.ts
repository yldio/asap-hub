import { parseGraphQLResearchOutput } from '../../../src/data-providers/transformers';
import { getSquidexGraphqlResearchOutput } from '../../fixtures/research-output.fixtures';

describe('parseGraphQLResearchOutput', () => {
  const output = getSquidexGraphqlResearchOutput();

  test('should flatten working group data', () => {
    output.flatData.workingGroups = [{ id: '123', flatData: { title: 'foo' } }];
    expect(parseGraphQLResearchOutput(output).workingGroups).toStrictEqual([
      { id: '123', title: 'foo' },
    ]);
    output.flatData.workingGroups = null;
    expect(parseGraphQLResearchOutput(output).workingGroups).toStrictEqual([]);
  });

  test('should flatten related research data', () => {
    const baseRelatedResearch = {
      id: '123',
      flatData: {
        title: 'RelatedR1',
        type: 'Report',
        documentType: 'Report',
        teams: [{ id: 'team-id-1', flatData: { displayName: 'Team B' } }],
        workingGroups: [
          {
            id: 'working-group-id-1',
            flatData: {
              title: 'Working Group B',
            },
          },
        ],
      },
    };

    output.flatData.relatedResearch = [baseRelatedResearch];
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual([
      {
        id: '123',
        title: 'RelatedR1',
        type: 'Report',
        documentType: 'Report',
        teams: [{ id: 'team-id-1', displayName: 'Team B' }],
        isOwnRelatedResearchLink: true,
        workingGroups: [
          {
            id: 'working-group-id-1',
            title: 'Working Group B',
          },
        ],
      },
      {
        id: 'related-referencing-research-id',
        title: 'Related Research2',
        type: 'Report',
        documentType: 'Bioinformatics',
        teams: [{ displayName: 'Team B', id: 'team-id-1' }],
        isOwnRelatedResearchLink: false,
        workingGroups: [
          {
            id: 'working-group-id-1',
            title: 'Working Group B',
          },
        ],
      },
    ]);

    output.flatData.relatedResearch = null;
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual([
      {
        id: 'related-referencing-research-id',
        title: 'Related Research2',
        type: 'Report',
        documentType: 'Bioinformatics',
        teams: [{ displayName: 'Team B', id: 'team-id-1' }],
        workingGroups: [
          {
            id: 'working-group-id-1',
            title: 'Working Group B',
          },
        ],
        isOwnRelatedResearchLink: false,
      },
    ]);

    output.flatData.relatedResearch = null;
    output.referencingResearchOutputsContents = null;
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual(
      [],
    );

    output.flatData.relatedResearch = [
      {
        ...baseRelatedResearch,
        flatData: {
          ...baseRelatedResearch.flatData,
          workingGroups: [
            { id: 'wg-123', flatData: { title: 'Example Working Group' } },
          ],
        },
      },
    ];
    expect(parseGraphQLResearchOutput(output).relatedResearch).toMatchObject([
      {
        workingGroups: [{ id: 'wg-123', title: 'Example Working Group' }],
      },
    ]);

    output.flatData.relatedResearch = [
      {
        ...baseRelatedResearch,
        flatData: {
          ...baseRelatedResearch.flatData,
          workingGroups: null,
        },
      },
    ];
    expect(parseGraphQLResearchOutput(output).relatedResearch).toMatchObject([
      {
        workingGroups: [],
      },
    ]);

    output.flatData.relatedResearch = [
      {
        ...baseRelatedResearch,
        flatData: {
          ...baseRelatedResearch.flatData,
          documentType: 'UnknowType',
          teams: null,
        },
      },
    ];
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual([
      {
        id: '123',
        title: 'RelatedR1',
        type: 'Report',
        documentType: 'Grant Document',
        teams: [],
        workingGroups: [
          {
            id: 'working-group-id-1',
            title: 'Working Group B',
          },
        ],
        isOwnRelatedResearchLink: true,
      },
    ]);

    output.flatData.relatedResearch = [
      {
        ...baseRelatedResearch,
        flatData: {
          ...baseRelatedResearch.flatData,
          workingGroups: null,
        },
      },
    ];
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual([
      {
        id: '123',
        title: 'RelatedR1',
        type: 'Report',
        documentType: 'Report',
        teams: [
          {
            displayName: 'Team B',
            id: 'team-id-1',
          },
        ],
        workingGroups: [],
        isOwnRelatedResearchLink: true,
      },
    ]);
  });

  test('should flatten related events data', () => {
    const relatedEvents: NonNullable<
      typeof output.flatData.relatedEvents
    >[number] = {
      id: '123',
      flatData: {
        title: 'RelatedR1',
        endDate: '2023-06-29T15:55:41.641Z',
      },
    };
    output.flatData.relatedEvents = [relatedEvents];
    expect(parseGraphQLResearchOutput(output).relatedEvents).toStrictEqual([
      {
        id: '123',
        title: 'RelatedR1',
        endDate: '2023-06-29T15:55:41.641Z',
      },
    ]);

    output.flatData.relatedEvents = null;
    expect(parseGraphQLResearchOutput(output).relatedEvents).toStrictEqual([]);
  });

  test('should flatten keywords data', () => {
    expect(parseGraphQLResearchOutput(output).keywords).toStrictEqual([
      'Keyword1',
    ]);

    output.flatData.keywords = null;
    expect(parseGraphQLResearchOutput(output).keywords).toStrictEqual([]);
  });

  test('should return statusChangedBy', () => {
    expect(parseGraphQLResearchOutput(output).statusChangedBy).toStrictEqual({
      id: 'status-changed-by-id',
      firstName: 'Tom',
      lastName: 'Hardy',
    });
  });
});
