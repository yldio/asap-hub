import { researchOutputLabels, ResearchOutputResponse, Role, UserResponse } from '@asap-hub/model';
import { GraphqlResearchOutput, User } from '@asap-hub/squidex';
import Users from '../../src/controllers/users';
import { createUser } from '../helpers/users';

const users = new Users();

describe('Research Outputs', () => {
  test('Should reject ROs with invalid identifierDOIs', async () => {
    const researchOutput: GraphqlResearchOutput = {
      id: "id",
      created: "created",
      flatData: {},
      lastModified: "lastModified"
    };
    
    await createResearchOutput(researchOutput);

    const result = await researchOutputs.fetch({});

    const expectedResponse: Partial<ResearchOutputResponse> = {
    };

    expect(result).toEqual({});

    // Submit something with an invalid identifierDOI
    // Should receive an error
  });
});