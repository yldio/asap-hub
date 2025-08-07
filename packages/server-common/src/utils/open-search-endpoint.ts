import {
  OpenSearchClient,
  DescribeDomainCommand,
} from '@aws-sdk/client-opensearch';

/**
 * Smart OpenSearch endpoint detection
 * AWS API lookup (auto-detection)
 */
export async function getOpenSearchEndpoint({
  awsRegion,
  stage,
}: {
  awsRegion: string;
  stage: string;
}): Promise<string> {
  const service = 'asap-hub';
  const domainName =
    stage === 'production'
      ? `${service}-${stage}-search` // asap-hub-production-search
      : `${service}-dev-search`; // asap-hub-dev-search

  try {
    const openSearchClient = new OpenSearchClient({ region: awsRegion });
    const command = new DescribeDomainCommand({ DomainName: domainName });

    const response = await openSearchClient.send(command);

    const endpoint = response.DomainStatus?.Endpoint;

    if (!endpoint) {
      throw new Error('Endpoint not found in AWS response');
    }

    const fullEndpoint = `https://${endpoint}`;
    return fullEndpoint;
  } catch (error) {
    throw new Error(
      `Could not determine OpenSearch endpoint for ${domainName}`,
    );
  }
}
