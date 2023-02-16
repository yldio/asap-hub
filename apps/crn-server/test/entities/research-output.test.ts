import { parseGraphQLResearchOutput } from '../../src/entities/research-output';
import { getSquidexGraphqlResearchOutput } from '../fixtures/research-output.fixtures';

describe('parseGraphQLResearchOutput', () => {
  const output = getSquidexGraphqlResearchOutput();
  output.flatData.workingGroups = [{ id: '123', flatData: { title: 'foo' } }];

  test('should flatten working group data', () => {});
  expect(parseGraphQLResearchOutput(output).workingGroups).toStrictEqual([
    { id: '123', title: 'foo' },
  ]);
});
