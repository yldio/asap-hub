import { parseGraphQLResearchOutput } from '../../src/entities/research-output';
import { getSquidexGraphqlResearchOutput } from '../fixtures/research-output.fixtures';

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
      },
    ]);

    output.flatData.relatedResearch = null;
    expect(parseGraphQLResearchOutput(output).relatedResearch).toStrictEqual(
      [],
    );

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
      },
    ]);
  });

  test('should flatten keywords data', () => {
    expect(parseGraphQLResearchOutput(output).keywords).toStrictEqual([
      'Keyword1',
    ]);

    output.flatData.keywords = null;
    expect(parseGraphQLResearchOutput(output).keywords).toStrictEqual([]);
  });
});
