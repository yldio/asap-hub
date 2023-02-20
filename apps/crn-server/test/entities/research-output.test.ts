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
});
