import { createClient } from 'contentful-management';
import { getOpenSearchEndpoint } from '@asap-hub/server-common';

// Environment variables
const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulEnvId = process.env.CONTENTFUL_ENV_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

// OpenSearch endpoint configuration
// Production domain: asap-hub-production-search
// Dev/PR domain: asap-hub-dev-search (shared by dev and all PR environments)
// Using shared getOpenSearchEndpoint utility from @asap-hub/server-common

// OpenSearch endpoint will be determined at runtime

// AWS credentials from environment
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const awsRegion = process.env.AWS_REGION || 'us-east-1';

// Initialize Contentful client
const contentfulClient = createClient({
  accessToken: contentfulManagementAccessToken,
});

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  id: string;
  name: string;
}

interface ComplianceDocument {
  id: string;
  title: string;
  status: string;
  lastUpdated: string;
  teams: Team[];
  assignedUsers: (User | null)[];
  apcRequested: boolean;
  apcCoverageRequestStatus?: string;
}

// AWS V4 signature for OpenSearch
async function createAWSSignature(
  method: string,
  url: string,
  body: string = '',
) {
  const crypto = await import('crypto');

  function hmac(key: string | Buffer, data: string): Buffer {
    return crypto.createHmac('sha256', key).update(data).digest();
  }

  function hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  const urlObj = new URL(url);
  const host = urlObj.host;
  const pathname = urlObj.pathname;
  const search = urlObj.search;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substr(0, 8);

  const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-date';
  const payloadHash = hash(body);

  const canonicalRequest = [
    method,
    pathname + search,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${awsRegion}/es/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    hash(canonicalRequest),
  ].join('\n');

  const kDate = hmac(`AWS4${awsSecretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, awsRegion);
  const kService = hmac(kRegion, 'es');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = hmac(kSigning, stringToSign).toString('hex');

  const authorizationHeader = `${algorithm} Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    Authorization: authorizationHeader,
    'X-Amz-Date': amzDate,
    'Content-Type': 'application/json',
  };
}

async function makeOpenSearchRequest(
  endpoint: string,
  method: string,
  path: string,
  body?: any,
) {
  const url = endpoint + path;
  const bodyStr = body ? JSON.stringify(body) : '';

  const opensearchUsername = process.env.OPENSEARCH_USERNAME;
  const opensearchPassword = process.env.OPENSEARCH_PASSWORD;

  if (opensearchUsername && opensearchPassword) {
    console.log('🔐 Using basic auth...');
    const auth = Buffer.from(
      `${opensearchUsername}:${opensearchPassword}`,
    ).toString('base64');

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: bodyStr || undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenSearch request failed: ${response.status} ${errorText}`,
      );
    }

    return await response.json();
  }

  try {
    console.log('🔐 Using AWS signing...');
    const headers = await createAWSSignature(method, url, bodyStr);

    const response = await fetch(url, {
      method,
      headers,
      body: bodyStr || undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenSearch request failed: ${response.status} ${errorText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`AWS signing failed:`, error);
    throw error;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchAllEntries = async (environment: any, contentType: string) => {
  console.log(`📥 Fetching ${contentType}...`);

  let allEntries: any[] = [];
  let skip = 0;
  const limit = 100;

  while (true) {
    try {
      if (skip > 0) await delay(150);

      const response = await environment.getEntries({
        content_type: contentType,
        skip,
        limit,
        include: 3,
      });

      allEntries = allEntries.concat(response.items);
      console.log(`  📄 Fetched ${allEntries.length} ${contentType}...`);

      if (response.items.length < limit) break;
      skip += limit;
    } catch (error) {
      console.error(`❌ Error fetching ${contentType}:`, error);
      break;
    }
  }

  return allEntries;
};

function extractReferences(field: any): string[] {
  if (!field) return [];

  const localizedField = field['en-US'] || field;

  if (Array.isArray(localizedField)) {
    return localizedField.map((item) => item.sys?.id).filter(Boolean);
  }

  if (localizedField && localizedField.sys && localizedField.sys.id) {
    return [localizedField.sys.id];
  }

  return [];
}

function extractAllTeamsAndUsersIds(manuscripts: any[]) {
  const teamIds = new Set<string>();
  const userIds = new Set<string>();

  manuscripts.forEach((manuscript) => {
    const teams = extractReferences(manuscript.fields.teams);
    teams.forEach((id) => teamIds.add(id));

    const users = extractReferences(manuscript.fields.assignedUsers);
    users.forEach((id) => userIds.add(id));
  });

  return {
    teamIds: Array.from(teamIds),
    userIds: Array.from(userIds),
  };
}

const fetchEntriesByIds = async (
  environment: any,
  entryIds: string[],
  include: number = 1,
) => {
  if (entryIds.length === 0) return [];

  const response = await environment.getEntries({
    'sys.id[in]': entryIds.join(','),
    include,
  });
  return response.items;
};

type Field = { sys: { type: string; linkType: string; id: string } };

function getField(field: string | { 'en-US': any }): any {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field['en-US'] || '';
}

function getBooleanField(field: any): boolean {
  if (typeof field === 'boolean') return field;
  return field?.['en-US'] === true;
}

async function buildLookups(teams: any[], users: any[]) {
  const teamsMap = new Map();
  const userMap = new Map();

  teams.forEach((team) => {
    const displayName =
      getField(team.fields.displayName) ||
      getField(team.fields.name) ||
      'Unknown Team';
    teamsMap.set(team.sys.id, {
      id: team.sys.id,
      name: displayName,
    });
  });

  users.forEach((user) => {
    const firstName = getField(user.fields.firstName);
    const lastName = getField(user.fields.lastName);
    const email = getField(user.fields.email);
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';

    userMap.set(user.sys.id, {
      name: fullName,
      email: email,
      avatar: (getField(user.fields.avatar) as Field)?.sys?.id,
    });
  });

  return { teamsMap, userMap };
}

function transformToComplianceDocument(
  manuscript: any,
  teamMap: Map<string, any>,
  userMap: Map<string, any>,
): ComplianceDocument {
  const fields = manuscript.fields;

  const title = getField(fields.title) || 'Untitled';
  const status = getField(fields.status) || 'unknown';
  const apcCoverageRequestStatus = getField(fields.apcCoverageRequestStatus);

  // Get teams array
  const teamIds = extractReferences(fields.teams);
  const teams: Team[] = teamIds
    .map((teamId) => teamMap.get(teamId))
    .filter(Boolean);

  // Get assigned users array
  const assignedUserIds = extractReferences(fields.assignedUsers);
  const assignedUsers: (User | null)[] = assignedUserIds
    .map((userId) => {
      const user = userMap.get(userId);
      if (user) {
        return {
          name: user.name,
          email: user.email || '',
          avatar: user.avatar || '',
        };
      }
      return null;
    })
    .filter(Boolean);

  const apcRequested = getBooleanField(fields.apcRequested);

  return {
    id: manuscript.sys.id,
    title,
    status,
    lastUpdated: manuscript.sys.updatedAt,
    teams,
    assignedUsers,
    apcRequested,
    apcCoverageRequestStatus,
  };
}

const indexComplianceData = async () => {
  try {
    console.log('🚀 Starting indexing...');
    console.log(`📍 Space: ${spaceId}`);
    console.log(`📍 Environment: ${contentfulEnvId}`);

    // Get OpenSearch endpoint
    const opensearchEndpoint = await getOpenSearchEndpoint();
    console.log(`📍 OpenSearch: ${opensearchEndpoint}`);

    // Check required environment variables
    const requiredEnvVars = [
      { name: 'CONTENTFUL_SPACE_ID', value: spaceId },
      { name: 'CONTENTFUL_ENV_ID', value: contentfulEnvId },
      {
        name: 'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN',
        value: contentfulManagementAccessToken,
      },
    ];

    const missingEnvVars = requiredEnvVars.filter((env) => !env.value);

    if (missingEnvVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingEnvVars.forEach((env) => console.error(`  - ${env.name}`));
      process.exit(1);
    }

    // Check AWS credentials if not using basic auth
    const opensearchUsername = process.env.OPENSEARCH_USERNAME;
    const opensearchPassword = process.env.OPENSEARCH_PASSWORD;

    if (!opensearchUsername || !opensearchPassword) {
      if (!awsAccessKeyId || !awsSecretAccessKey) {
        console.error('❌ Missing authentication credentials');
        console.log(
          '💡 Either set OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD for basic auth,',
        );
        console.log(
          '💡 or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for AWS signing',
        );
        process.exit(1);
      }
      console.log('✅ AWS credentials found - will use AWS signing');
    } else {
      console.log('✅ OpenSearch credentials found - will use basic auth');
    }

    // Test OpenSearch connection
    try {
      const health = (await makeOpenSearchRequest(
        opensearchEndpoint,
        'GET',
        '/_cluster/health',
      )) as { status: string };
      console.log(`✅ OpenSearch connected! Status: ${health.status}`);
    } catch (error) {
      console.error('❌ OpenSearch connection failed:', error);
      console.log('💡 Check your AWS credentials and OpenSearch permissions');
      return;
    }

    // Get Contentful data
    const space = await contentfulClient.getSpace(spaceId);
    const environment = await space.getEnvironment(contentfulEnvId);

    const manuscripts = await fetchAllEntries(environment, 'manuscripts');
    console.log(`\n 📄 Found ${manuscripts.length} manuscripts`);

    const { teamIds, userIds } = extractAllTeamsAndUsersIds(manuscripts);
    console.log('teamIds', teamIds);
    console.log('userIds', userIds);

    const [teams, users] = await Promise.all([
      fetchEntriesByIds(environment, teamIds),
      fetchEntriesByIds(environment, userIds, 2),
    ]);

    const { teamsMap, userMap } = await buildLookups(teams, users);

    console.log(
      'userMap',
      JSON.stringify(Array.from(userMap.values()), null, 2),
    );

    // Filter out undefined avatar IDs before fetching
    const avatarIds = Array.from(userMap.values())
      .map((user) => user.avatar)
      .filter(Boolean);

    console.log('avatarIds to fetch:', avatarIds);

    let avatars: any[] = [];
    if (avatarIds.length > 0) {
      const assetsResponse = await environment.getAssets({
        'sys.id[in]': avatarIds.join(','),
      });
      avatars = assetsResponse.items;
    }

    console.log('avatars', JSON.stringify(avatars, null, 2));

    const avatarMap = new Map();
    avatars.forEach((avatar: any) => {
      const url = avatar.fields.file['en-US']?.url;
      if (url) {
        avatarMap.set(
          avatar.sys.id,
          url.startsWith('//') ? `https:${url}` : url,
        );
      }
    });

    console.log(
      'avatarMap',
      JSON.stringify(Array.from(avatarMap.entries()), null, 2),
    );

    // Update userMap with avatar URLs
    Array.from(userMap.entries()).forEach(([userId, user]: [string, any]) => {
      const avatarUrl = avatarMap.get(user.avatar);
      userMap.set(userId, {
        ...user,
        avatar: avatarUrl || null,
      });
    });

    console.log(
      'final userMap',
      JSON.stringify(Array.from(userMap.values()), null, 2),
    );

    // Transform to compliance documents
    const documents = manuscripts.map((m) =>
      transformToComplianceDocument(m, teamsMap, userMap),
    );

    console.log(`\n🔄 Transformed ${documents.length} compliance documents`);

    // Debug: Show a sample document
    if (documents.length > 0) {
      console.log('\n🔍 Sample transformed document:');
      console.log(JSON.stringify(documents[0], null, 2));
    }

    // Create index
    console.log('\n📋 Creating index...');
    const indexName = 'compliance-data';

    try {
      await makeOpenSearchRequest(opensearchEndpoint, 'HEAD', `/${indexName}`);
      console.log('  ℹ️  Index already exists - deleting and recreating...');

      await makeOpenSearchRequest(
        opensearchEndpoint,
        'DELETE',
        `/${indexName}`,
      );
      console.log('  🗑️  Old index deleted');

      await delay(1000);
    } catch (error) {
      console.log('  ℹ️  No existing index to delete');
    }

    // Create the index with correct mapping
    const indexConfig = {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            fields: { keyword: { type: 'keyword' } },
          },
          status: { type: 'keyword' },
          lastUpdated: { type: 'date' },
          teams: {
            type: 'nested',
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                fields: { keyword: { type: 'keyword' } },
              },
            },
          },
          assignedUsers: {
            type: 'nested',
            properties: {
              name: {
                type: 'text',
                fields: { keyword: { type: 'keyword' } },
              },
              email: { type: 'keyword' },
              avatar: { type: 'keyword' },
            },
          },
          apcRequested: { type: 'boolean' },
          apcCoverageRequestStatus: { type: 'keyword' },
        },
      },
    };

    await makeOpenSearchRequest(
      opensearchEndpoint,
      'PUT',
      `/${indexName}`,
      indexConfig,
    );
    console.log('  ✅ Index created with correct mapping');

    // Index documents
    console.log('\n📝 Indexing documents...');
    let indexed = 0;

    for (const doc of documents) {
      try {
        await makeOpenSearchRequest(
          opensearchEndpoint,
          'PUT',
          `/${indexName}/_doc/${doc.id}`,
          doc,
        );
        indexed++;

        if (indexed % 10 === 0) {
          console.log(
            `  📄 Indexed ${indexed}/${documents.length} documents...`,
          );
        }

        await delay(50);
      } catch (error) {
        console.error(`❌ Failed to index document ${doc.id}:`, error);
      }
    }

    console.log(`  ✅ Successfully indexed ${indexed} documents`);

    // Verify
    console.log('\n🔍 Verifying...');
    await delay(1000);

    try {
      const countResult = (await makeOpenSearchRequest(
        opensearchEndpoint,
        'GET',
        `/${indexName}/_count`,
      )) as { count: number };
      console.log(`🎉 Success! ${countResult.count} documents in index`);
    } catch (error) {
      console.error('❌ Verification failed:', error);
    }
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

indexComplianceData();
