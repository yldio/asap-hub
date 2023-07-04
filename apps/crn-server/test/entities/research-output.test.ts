import { parseGraphQLResearchOutput } from '../../src/data-providers/entities/research-output';
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
        isOwnRelatedResearchLink: true,
      },
      {
        id: 'related-referencing-research-id',
        title: 'Related Research2',
        type: 'Report',
        documentType: 'Bioinformatics',
        teams: [{ displayName: 'Team B', id: 'team-id-1' }],
        isOwnRelatedResearchLink: false,
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

  test('should not return reviewRequestedBy', () => {
    expect(
      parseGraphQLResearchOutput(output).reviewRequestedBy,
    ).toBeUndefined();
  });

  test('should return reviewRequestedBy', () => {
    output.flatData.reviewRequestedBy = [
      {
        id: 'review-requested-by-id',
        flatData: {
          firstName: 'First',
          lastName: 'Last',
        },
      },
    ];
    expect(parseGraphQLResearchOutput(output).reviewRequestedBy).toStrictEqual({
      id: 'review-requested-by-id',
      firstName: 'First',
      lastName: 'Last',
    });
  });
});
