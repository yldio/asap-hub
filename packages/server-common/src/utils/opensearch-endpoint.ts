import {
  OpenSearchClient,
  DescribeDomainCommand,
} from '@aws-sdk/client-opensearch';

/**
 * Smart OpenSearch endpoint detection
 * Priority order:
 * 1. CloudFormation output (OPENSEARCH_DOMAIN_ENDPOINT)
 * 2. Manual override (OPENSEARCH_ENDPOINT)
 * 3. AWS API lookup (auto-detection)
 */
export async function getOpenSearchEndpoint(): Promise<string> {
  // 1. Try CloudFormation output first (deployed Lambda environments)
  const cloudFormationEndpoint = process.env.OPENSEARCH_DOMAIN_ENDPOINT;
  if (cloudFormationEndpoint) {
    console.log('✅ Using CloudFormation endpoint from deployment');
    return cloudFormationEndpoint.startsWith('https://')
      ? cloudFormationEndpoint
      : `https://${cloudFormationEndpoint}`;
  }

  // 2. Try manual override (for local testing)
  const manualEndpoint = process.env.OPENSEARCH_ENDPOINT;
  if (manualEndpoint) {
    console.log('✅ Using manual endpoint override');
    return manualEndpoint;
  }

  // 3. Auto-detect via AWS API (GitHub Actions, local dev without override)
  console.log('🔍 Auto-detecting OpenSearch endpoint via AWS SDK...');

  const awsRegion = process.env.AWS_REGION || 'us-east-1';

  // Determine domain name (same logic as serverless.ts)
  const stage = process.env.ENVIRONMENT || process.env.SLS_STAGE || 'dev';
  const service = 'asap-hub';
  const domainName =
    stage === 'production'
      ? `${service}-${stage}-search` // asap-hub-production-search
      : `${service}-dev-search`; // asap-hub-dev-search

  console.log(`📍 Looking up domain: ${domainName} (stage: ${stage})`);

  try {
    // Use AWS SDK - much simpler!
    const openSearchClient = new OpenSearchClient({ region: awsRegion });
    const command = new DescribeDomainCommand({ DomainName: domainName });
    const response = await openSearchClient.send(command);

    const endpoint = response.DomainStatus?.Endpoint;

    if (!endpoint) {
      throw new Error('Endpoint not found in AWS response');
    }

    const fullEndpoint = `https://${endpoint}`;
    console.log(`✅ Auto-detected endpoint: ${fullEndpoint}`);
    return fullEndpoint;
  } catch (error) {
    console.error(
      `❌ Failed to auto-detect endpoint for ${domainName}:`,
      error,
    );
    console.log('💡 Fallback options:');
    console.log(
      '💡 Set OPENSEARCH_ENDPOINT environment variable with the full URL',
    );
    console.log(
      `💡 Get it from: AWS Console > OpenSearch Service > Domains > ${domainName}`,
    );
    throw new Error(
      `Could not determine OpenSearch endpoint for ${domainName}`,
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
