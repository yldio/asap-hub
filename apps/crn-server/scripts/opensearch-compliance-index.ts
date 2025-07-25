import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { getOpenSearchEndpoint } from '@asap-hub/server-common';
import { getManuscriptsDataProvider } from '../src/dependencies/manuscripts.dependencies';
import ManuscriptController from '../src/controllers/manuscript.controller';
import { getExternalAuthorDataProvider } from '../src/dependencies/external-authors.dependencies';
import { getAssetDataProvider } from '../src/dependencies/users.dependencies';

const awsRegion = process.env.AWS_REGION || 'us-east-1';

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function transformToManuscriptDocument(manuscript: any): ManuscriptDocument {
  console.log('manuscript', manuscript);

  return {
    id: manuscript.id,
    manuscriptId: manuscript.manuscriptId,
    title: manuscript.title,
    url: manuscript.url,
    teams: manuscript.teams,
    assignedUsers: manuscript.assignedUsers || [],
    status: manuscript.status,
    apcRequested: manuscript.apcRequested,
    apcAmountRequested: manuscript.apcAmountRequested,
    apcCoverageRequestStatus: manuscript.apcCoverageRequestStatus,
    apcAmountPaid: manuscript.apcAmountPaid,
    declinedReason: manuscript.declinedReason,
    lastUpdated: manuscript.lastUpdated,
    team: manuscript.team,
  };
}

const indexManuscriptData = async () => {
  try {
    console.log('🚀 Starting indexing...');

    // Get OpenSearch endpoint
    const opensearchEndpoint = await getOpenSearchEndpoint();
    console.log(`📍 OpenSearch: ${opensearchEndpoint}`);

    // Initialize OpenSearch client
    let client: Client;

    const opensearchUsername = process.env.OPENSEARCH_USERNAME;
    const opensearchPassword = process.env.OPENSEARCH_PASSWORD;

    if (opensearchUsername && opensearchPassword) {
      console.log('🔐 Using basic auth...');
      client = new Client({
        node: opensearchEndpoint,
        auth: {
          username: opensearchUsername,
          password: opensearchPassword,
        },
        ssl: {
          rejectUnauthorized: false, // For development - remove in production
        },
      });
    } else {
      console.log('🔐 Using AWS Sigv4 signing...');
      client = new Client({
        ...AwsSigv4Signer({
          getCredentials: defaultProvider(),
          region: awsRegion,
        }),
        node: opensearchEndpoint,
      });
    }

    // Test OpenSearch connection
    try {
      const health = await client.cluster.health();
      console.log(`✅ OpenSearch connected! Status: ${health.body.status}`);
    } catch (error) {
      console.error('❌ OpenSearch connection failed:', error);
      console.log('💡 Check your AWS credentials and OpenSearch permissions');
      return;
    }

    // Get manuscript data
    const externalAuthorDataProvider = getExternalAuthorDataProvider();
    const assetDataProvider = getAssetDataProvider();
    const manuscriptDataProvider = getManuscriptsDataProvider();
    const manuscriptController = new ManuscriptController(
      manuscriptDataProvider,
      externalAuthorDataProvider,
      assetDataProvider,
    );

    let allManuscripts: any[] = [];
    let skip = 0;
    const limit = 100;

    console.log('📥 Fetching manuscripts...');
    while (true) {
      if (skip > 0) await delay(5);
      const manuscriptsResponse = await manuscriptController.fetch({
        take: limit,
        skip,
      });
      allManuscripts = allManuscripts.concat(manuscriptsResponse.items);
      console.log(`  📄 Fetched ${allManuscripts.length} manuscripts...`);
      if (manuscriptsResponse.items.length < limit) break;
      skip += limit;
    }

    console.log(`\n📄 Found ${allManuscripts.length} manuscripts`);

    // Transform to manuscript documents
    const documents = allManuscripts.map((m) =>
      transformToManuscriptDocument(m),
    );

    console.log(`\n🔄 Transformed ${documents.length} manuscript documents`);

    // Debug: Show a sample document
    if (documents.length > 0) {
      console.log('\n🔍 Sample transformed document:');
      console.log(JSON.stringify(documents[0], null, 2));
    }

    // Create index
    console.log('\n📋 Managing index...');
    const indexName = 'compliance-data';

    // Check if index exists and delete if it does
    try {
      const indexExists = await client.indices.exists({ index: indexName });
      if (indexExists.body) {
        console.log('  ℹ️  Index already exists - deleting...');
        await client.indices.delete({ index: indexName });
        await client.indices.delete({ index: 'manuscript-data' });
        console.log('  🗑️  Old index deleted');
        await delay(1000);
      }
    } catch (error) {
      console.log('  ℹ️  No existing index to delete');
    }

    const indexConfig = {
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
      mappings: {
        properties: {
          id: {
            type: 'keyword' as const,
          },
          manuscriptId: {
            type: 'keyword' as const,
          },
          title: {
            type: 'text' as const,
            fields: {
              keyword: { type: 'keyword' as const },
            },
          },
          url: {
            type: 'keyword' as const,
          },
          status: {
            type: 'keyword' as const,
          },
          lastUpdated: {
            type: 'date' as const,
          },
          teams: {
            type: 'text' as const,
            fields: {
              keyword: { type: 'keyword' as const },
            },
          },
          team: {
            type: 'object' as const,
            properties: {
              id: { type: 'keyword' as const },
              displayName: {
                type: 'text' as const,
                fields: {
                  keyword: { type: 'keyword' as const },
                },
              },
            },
          },
          assignedUsers: {
            type: 'nested' as const,
            properties: {
              id: { type: 'keyword' as const },
              firstName: {
                type: 'text' as const,
                fields: { keyword: { type: 'keyword' as const } },
              },
              lastName: {
                type: 'text' as const,
                fields: { keyword: { type: 'keyword' as const } },
              },
              avatarUrl: { type: 'keyword' as const },
            },
          },
          apcRequested: {
            type: 'boolean' as const,
          },
          apcAmountRequested: {
            type: 'float' as const,
          },
          apcCoverageRequestStatus: {
            type: 'keyword' as const,
          },
          apcAmountPaid: {
            type: 'float' as const,
          },
          declinedReason: {
            type: 'text' as const,
            fields: { keyword: { type: 'keyword' as const } },
          },
        },
      },
    };

    // Create the index
    await client.indices.create({
      index: indexName,
      body: indexConfig as any,
    });
    console.log('  ✅ Index created with correct mapping');

    // Index documents using bulk API for better performance
    console.log('\n📝 Indexing documents...');

    const bulkBody = [];
    for (const doc of documents) {
      // Add index action
      bulkBody.push({
        index: {
          _index: indexName,
          _id: doc.id,
        },
      });
      // Add document
      bulkBody.push(doc);
    }

    if (bulkBody.length > 0) {
      try {
        const bulkResponse = await client.bulk({
          body: bulkBody,
        });

        if (bulkResponse.body.errors) {
          console.warn('⚠️  Some documents had indexing errors:');
          bulkResponse.body.items.forEach((item: any, index: number) => {
            if (item.index?.error) {
              console.error(`  Document ${index}: ${item.index.error.reason}`);
            }
          });
        }

        const successfulDocs = bulkResponse.body.items.filter(
          (item: any) => !item.index?.error,
        ).length;

        console.log(`  ✅ Successfully indexed ${successfulDocs} documents`);
      } catch (error) {
        console.error('❌ Bulk indexing failed:', error);
      }
    }

    // Refresh index to make documents searchable immediately
    await client.indices.refresh({ index: indexName });

    // Verify
    console.log('\n🔍 Verifying...');
    await delay(1000);

    try {
      const countResult = await client.count({ index: indexName });
      console.log(`🎉 Success! ${countResult.body.count} documents in index`);

      // Show index info
      const indexInfo = await client.indices.get({ index: indexName });
      const settings = indexInfo.body?.[indexName]?.settings?.index;
      if (settings) {
        console.log(`📊 Index settings: ${JSON.stringify(settings, null, 2)}`);
      }
    } catch (error) {
      console.error('❌ Verification failed:', error);
    }
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
};

indexManuscriptData();
