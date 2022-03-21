// import assert from 'assert';
import { AWS } from '@serverless/typescript';

// ['AWS_ACM_CERTIFICATE_ARN', 'ASAP_HOSTNAME'].forEach((env) => {
//   assert.ok(process.env[env], `${env} not defined`);
// });

const region =
  (process.env.AWS_REGION as AWS['provider']['region']) || 'us-east-1';
const service = 'gp2-hub';
const stage = '12345-gp2';
// const apiHostname = 'api-12345.gp2.asap.science';
// const hostedZone = process.env.ASAP_HOSTNAME;
// const acmCertificateArn = process.env.AWS_ACM_CERTIFICATE_ARN;

export const plugins = ['./serverless-plugins/serverless-webpack'];

const serverlessConfig: AWS = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    timeout: 16,
    memorySize: 512,
    region,
    stage,
    httpApi: {
      payload: '2.0',
    },
    logs: {
      httpApi: {
        format:
          '{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod", "path":"$context.path", "routeKey":"$context.routeKey", "status":"$context.status","protocol":"$context.protocol", "responseLength":"$context.responseLength", "integrationRequestId": "$context.integration.requestId", "functionResponseStatus": "$context.integration.status" }',
      },
    },
    environment: {
      SQUIDEX_APP_NAME: '${env:SQUIDEX_APP_NAME}',
      SQUIDEX_BASE_URL: '${env:SQUIDEX_BASE_URL}',
      SQUIDEX_CLIENT_ID: '${env:SQUIDEX_CLIENT_ID}',
      SQUIDEX_CLIENT_SECRET: '${env:SQUIDEX_CLIENT_SECRET}',
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: false,
  },
  custom: {
    webpack: {
      config: './webpack.config.js',
      packager: 'yarn'
    },
  },
  functions: {
    apiHandler: {
      handler: 'src/handlers/api-handler.apiHandler',
      events: [
        {
          httpApi: {
            method: '*',
            path: '*',
          },
        },
      ],
    },
  },
  // resources: {
  //   Resources: {
  //     HttpApiDomain: {
  //       Type: 'AWS::ApiGatewayV2::DomainName',
  //       Properties: {
  //         DomainName: apiHostname,
  //         DomainNameConfigurations: [
  //           {
  //             CertificateArn: acmCertificateArn,
  //             EndpointType: 'REGIONAL',
  //           },
  //         ],
  //       },
  //     },
  //     HttpApiApiMapping: {
  //       Type: 'AWS::ApiGatewayV2::ApiMapping',
  //       DependsOn: ['HttpApiDomain'],
  //       Properties: {
  //         ApiId: { Ref: 'HttpApi' },
  //         ApiMappingKey: '',
  //         DomainName: apiHostname,
  //         Stage: { Ref: 'HttpApiStage' },
  //       },
  //     },
  //     HttpApiRecordSetGroup: {
  //       Type: 'AWS::Route53::RecordSetGroup',
  //       Properties: {
  //         HostedZoneName: hostedZone,
  //         RecordSets: [
  //           {
  //             Name: apiHostname,
  //             Type: 'A',
  //             AliasTarget: {
  //               DNSName: {
  //                 'Fn::GetAtt': ['HttpApiDomain', 'RegionalDomainName'],
  //               },
  //               HostedZoneId: {
  //                 'Fn::GetAtt': ['HttpApiDomain', 'RegionalHostedZoneId'],
  //               },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   },
  // },
};

module.exports = serverlessConfig;
