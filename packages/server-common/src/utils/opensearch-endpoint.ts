import {
  OpenSearchClient,
  DescribeDomainCommand,
} from '@aws-sdk/client-opensearch';

/**
 * Opensearch endpoint detection
 * AWS API lookup (auto-detection)
 */
export async function getOpensearchEndpoint({
  awsRegion,
  stage,
}: {
  awsRegion: string;
  stage: string;
}): Promise<string> {
  const service = 'asap-hub';
  const domainName =
    stage === 'production'
      ? `${service}-${stage}-search`
      : `${service}-dev-search`;

  try {
    // Use AWS SDK
    const opensearchClient = new OpenSearchClient({ region: awsRegion });
    const command = new DescribeDomainCommand({ DomainName: domainName });

    const response = await opensearchClient.send(command);

    const endpoint = response.DomainStatus?.Endpoint;

    if (!endpoint) {
      throw new Error('Endpoint not found in AWS response');
    }

    const fullEndpoint = `https://${endpoint}`;
    return fullEndpoint;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not determine Opensearch endpoint for ${domainName}: ${errorMessage}`,
    );
  }
}

/**
 * Extract just the domain part from a full endpoint URL
 * Example: "https://search-domain-abc123.us-east-1.es.amazonaws.com" → "search-domain-abc123.us-east-1.es.amazonaws.com"
 */
export function extractDomainFromEndpoint(endpoint: string): string {
  try {
    const url = new URL(endpoint);
    return url.host;
  } catch {
    // If it's already just the domain without protocol, return as-is
    return endpoint.replace(/^https?:\/\//, '');
  }
}
