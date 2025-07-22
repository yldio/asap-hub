import { ManuscriptVersion } from '@asap-hub/model';
import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
import { region, environment } from '../config';
import logger from '../utils/logger';
import ManuscriptController from '../controllers/manuscript.controller';
import { getExternalAuthorDataProvider } from '../dependencies/external-authors.dependencies';
import { getAssetDataProvider } from '../dependencies/users.dependencies';
import { getManuscriptsDataProvider } from '../dependencies/manuscripts.dependencies';
import { getTeamDataProvider } from '../dependencies/team.dependencies';

interface ManuscriptDocument {
  id: string;
  manuscriptId: string;
  title: string;
  url?: string;
  teams: string;
  assignedUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }>;
  status: string;
  apcRequested?: boolean;
  apcAmountRequested?: number;
  apcCoverageRequestStatus?: string | null;
  apcAmountPaid?: number;
  declinedReason?: string;
  lastUpdated: string;
  team: {
    id: string;
    displayName: string;
  };
}

export default class OpenSearchProvider {
  private lambda: LambdaClient;
  private stage: string;

  constructor() {
    this.lambda = new LambdaClient({ region });
    this.stage =
      environment === 'development' || environment === 'local'
        ? 'dev'
        : environment;
  }

  private async transformToManuscriptDocument(
    manuscriptId: string,
    userId: string,
  ): Promise<Omit<ManuscriptDocument, 'id'>> {
    const externalAuthorDataProvider = getExternalAuthorDataProvider();
    const assetDataProvider = getAssetDataProvider();
    const manuscriptDataProvider = getManuscriptsDataProvider();
    const teamDataProvider = getTeamDataProvider();
    const manuscriptController = new ManuscriptController(
      manuscriptDataProvider,
      externalAuthorDataProvider,
      assetDataProvider,
    );
    const manuscript = await manuscriptController.fetchById(
      manuscriptId,
      userId,
    );

    // Extract the latest version to get team and version info
    const latestVersion = manuscript.versions[manuscript.versions.length - 1];
    const versionTeam = latestVersion?.teams?.[0];

    // Fetch team data to get grantId and teamId code
    let teamIdCode = '';
    let grantId = '';
    let teamDisplayName = '';

    if (versionTeam?.id) {
      try {
        const teamData = await teamDataProvider.fetchById(versionTeam.id);
        if (teamData) {
          teamIdCode = teamData.teamId || '';
          grantId = teamData.grantId || '';
          teamDisplayName = teamData.displayName || versionTeam.displayName;
        }
      } catch (error) {
        logger.error('Error fetching team data:', error);
        // Fallback to version team data
        teamDisplayName = versionTeam.displayName;
      }
    }

    // Generate manuscriptId similar to how it's done in the data provider
    const generatedManuscriptId = latestVersion
      ? this.generateManuscriptVersionUID({
          version: {
            type: latestVersion.type,
            count: latestVersion.count,
            lifecycle: latestVersion.lifecycle,
          },
          teamIdCode,
          grantId,
          manuscriptCount: manuscript.count,
        })
      : '';

    // Generate teams string from version teams
    const teamsString =
      latestVersion?.teams?.map((t) => t.displayName).join(', ') || '';
    const doc = {
      manuscriptId: generatedManuscriptId,
      title: manuscript.title,
      url: manuscript.url,
      teams: teamsString,
      assignedUsers: manuscript.assignedUsers || [],
      status: manuscript.status || '',
      apcRequested: manuscript.apcRequested,
      apcAmountRequested: manuscript.apcAmountRequested,
      apcCoverageRequestStatus: manuscript.apcCoverageRequestStatus,
      apcAmountPaid: manuscript.apcAmountPaid,
      declinedReason: manuscript.declinedReason,
      lastUpdated: latestVersion?.publishedAt || '',
      team: {
        id: versionTeam?.id || '',
        displayName: teamDisplayName,
      },
    };

    return doc;
  }

  // Helper method to generate manuscript version UID (similar to the one in manuscript.data-provider.ts)
  private generateManuscriptVersionUID({
    version,
    teamIdCode,
    grantId,
    manuscriptCount,
  }: {
    version: Pick<ManuscriptVersion, 'count' | 'lifecycle' | 'type'>;
    teamIdCode: string;
    grantId: string;
    manuscriptCount: number;
  }): string {
    const manuscriptTypeCode =
      version.type === 'Original Research' ? 'org' : 'rev';

    const lifecycleCode = this.getLifecycleCode(version.lifecycle || '');
    return `${teamIdCode}-${grantId}-${String(manuscriptCount).padStart(
      3,
      '0',
    )}-${manuscriptTypeCode}-${lifecycleCode}-${version.count}`;
  }

  // Helper method to get lifecycle code (similar to the one in manuscript.data-provider.ts)
  private getLifecycleCode(lifecycle: string): string {
    switch (lifecycle) {
      case 'Draft Manuscript (prior to Publication)':
        return 'G';
      case 'Preprint':
        return 'P';
      case 'Publication':
        return 'D';
      case 'Publication with addendum or corrigendum':
        return 'C';
      case 'Typeset proof':
        return 'T';
      case 'Other':
      default:
        return 'O';
    }
  }
  /**
   * Helper to invoke the OpenSearch Lambda function
   */
  private async invokeLambda(
    method: string,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any,
    pathParameters?: Record<string, string>,
  ): Promise<OpenSearchResponse> {
    // Structure the event exactly like API Gateway would send it
    const event = {
      version: '2.0',
      routeKey: `${method.toUpperCase()} ${path}`,
      rawPath: path,
      rawQueryString: '',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      requestContext: {
        http: {
          method: method.toUpperCase(),
          path,
          protocol: 'HTTP/1.1',
          sourceIp: '127.0.0.1',
        },
        requestId: `lambda-invoke-${Date.now()}`,
        stage: '$default',
      },
      pathParameters: pathParameters || null,
      queryStringParameters: null,
      ...(body && {
        body: JSON.stringify(body),
        isBase64Encoded: false,
      }),
    };

    const lambdaParams = {
      FunctionName: `asap-hub-${this.stage}-openSearchHandler`,
      InvocationType: InvocationType.RequestResponse,
      Payload: JSON.stringify(event),
    };

    const command = new InvokeCommand(lambdaParams);
    const response = await this.lambda.send(command);

    if (!response.Payload) {
      throw new Error('Lambda returned an empty response');
    }

    const payloadText = response.Payload.toString().trim();

    try {
      const payload = JSON.parse(payloadText);

      // Check for Lambda execution errors
      if (payload.errorType || payload.errorMessage) {
        throw new Error(
          `Lambda execution error: ${
            payload.errorMessage || payload.errorType
          }`,
        );
      }

      if (payload.statusCode && payload.statusCode >= 400) {
        const errorBody =
          typeof payload.body === 'string'
            ? JSON.parse(payload.body)
            : payload.body;
        throw new Error(
          `OpenSearch operation failed with status ${
            payload.statusCode
          }: ${JSON.stringify(errorBody)}`,
        );
      }

      if (!payload.body) {
        throw new Error('Lambda response missing body');
      }

      const parsedBody =
        typeof payload.body === 'string'
          ? JSON.parse(payload.body)
          : payload.body;

      // The framework wraps the response in a 'data' property for successful responses
      return parsedBody.data || parsedBody;
    } catch (parseError) {
      logger.error('Error parsing Lambda response', {
        rawPayload: payloadText,
        errorMessage: (parseError as Error).message,
      });
      throw new Error(`Invalid JSON response from Lambda: ${payloadText}`);
    }
  }

  /**
   * Search across indices
   */
  async search(params: {
    index: string;
    body: OpenSearchRequest;
    size?: number;
    from?: number;
  }): Promise<OpenSearchResponse> {
    try {
      const searchQuery = {
        query: params.body,
        ...(params.size && { size: params.size }),
        ...(params.from && { from: params.from }),
      };

      const response = await this.invokeLambda(
        'POST',
        `/opensearch/search/${params.index}`,
        searchQuery,
        { index: params.index },
      );

      return response;
    } catch (error) {
      logger.error('OpenSearch search failed', {
        error,
        index: params.index,
        searchBody: params.body,
      });
      throw error;
    }
  }

  /**
   * Update a document in an index
   */
  async update(params: {
    index: string;
    id: string;
    body: {
      doc_as_upsert: boolean;
      userId: string;
    };
    timeout?: string;
    retry_on_conflict?: number;
  }): Promise<OpenSearchResponse> {
    try {
      const doc = await this.transformToManuscriptDocument(
        params.id,
        params.body.userId,
      );

      const updateBody = {
        doc,
        doc_as_upsert: params.body.doc_as_upsert,
        refresh: 'wait_for',
        ...(params.retry_on_conflict && {
          retry_on_conflict: params.retry_on_conflict,
        }),
      };

      const response = await this.invokeLambda(
        'PUT',
        `/opensearch/update/${params.index}/${params.id}`,
        updateBody,
        {
          index: params.index,
          id: params.id,
        },
      );

      return response;
    } catch (error) {
      logger.error('OpenSearch update failed', {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
        index: params.index,
        documentId: params.id,
        timeout: params.timeout,
        retryOnConflict: params.retry_on_conflict,
      });
      throw error;
    }
  }

  //   /**
  //    * Index a document - might need to be updated - not tested
  //    */
  //   async indexDocument(params: {
  //     index: string;
  //     id?: string;
  //     body: OpenSearchRequest;
  //     refresh?: boolean;
  //   }): Promise<OpenSearchResponse> {
  //     try {
  //       const indexPath = `/opensearch/index/${params.index}`;
  //       const requestBody = {
  //         ...params.body,
  //         ...(params.id && { _id: params.id }),
  //         ...(params.refresh && { refresh: 'true' }),
  //       };

  //       const response = await this.invokeLambda('POST', indexPath, requestBody);

  //       return response;
  //     } catch (error) {
  //       logger.error('OpenSearch document indexing failed', {
  //         error,
  //         index: params.index,
  //         documentId: params.id,
  //       });
  //       throw error;
  //     }
  //   }

  //   /**
  //    * Delete a document - might need to be updated - not tested
  //    */
  //   async deleteDocument(params: {
  //     index: string;
  //     id: string;
  //     refresh?: boolean;
  //   }): Promise<OpenSearchResponse> {
  //     try {
  //       const deletePath = `/opensearch/delete/${params.index}/${params.id}`;
  //       const requestBody = {
  //         ...(params.refresh && { refresh: 'true' }),
  //       };

  //       const response = await this.invokeLambda(
  //         'DELETE',
  //         deletePath,
  //         requestBody,
  //       );

  //       return response;
  //     } catch (error) {
  //       logger.error('OpenSearch document deletion failed', {
  //         error,
  //         index: params.index,
  //         documentId: params.id,
  //       });
  //       throw error;
  //     }
  //   }

  //   /**
  //    * Check if OpenSearch cluster is healthy (via search on a common index)
  //    */
  //   async healthCheck(): Promise<boolean> {
  //     try {
  //       // Perform a simple search to check if OpenSearch is responsive
  //       await this.search({
  //         index: '_cluster',
  //         body: { query: { match_all: {} } },
  //         size: 1,
  //       });
  //       return true;
  //     } catch (error) {
  //       logger.error('OpenSearch health check failed', { error });
  //       return false;
  //     }
  //   }
}
