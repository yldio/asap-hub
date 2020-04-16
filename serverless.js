const { paramCase } = require('param-case');
const pkg = require('./package.json');

const service = paramCase(pkg.name);
const plugins = ['serverless-s3-sync'];

module.exports = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 128,
    memorySize: 512,
    region: `\${env:AWS_REGION, "us-east-1"}`,
    stage: `\${env:SLS_STAGE, "development"}`,
  },
  custom: {
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-static`,
        localDir: 'apps/frontend/build',
      },
    ],
  },
  resources: {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: `\${self:service}-\${self:provider.stage}-static`,
          AccessControl: 'PublicRead',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ['GET', 'HEAD'],
                AllowedHeaders: ['*'],
                AllowedOrigins: ['*'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: `\${self:service}-\${self:provider.stage}-static`,
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket', 'Arn'] }, '/*']],
                },
              },
            ],
          },
        },
      },
      CloudFrontOriginAccessIdentity: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'Bucket' },
          },
        },
      },
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: ['Bucket'],
        Properties: {
          DistributionConfig: {
            CustomErrorResponses: [
              {
                ErrorCode: 404,
                ResponseCode: 200,
                ResponsePagePath: '/index.html',
              },
            ],
            Origins: [
              {
                DomainName: {
                  'Fn::GetAtt': ['Bucket', 'RegionalDomainName'],
                },
                Id: 's3origin',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentity' },
                      ],
                    ],
                  },
                },
              },
            ],
            Enabled: true,
            DefaultRootObject: 'index.html',
            DefaultCacheBehavior: {
              AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
              CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
              Compress: true,
              DefaultTTL: 3600,
              ForwardedValues: {
                Cookies: {
                  Forward: 'none',
                },
                QueryString: false,
              },
              TargetOriginId: 's3origin',
              ViewerProtocolPolicy: 'redirect-to-https',
            },
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              CloudFrontDefaultCertificate: true,
            },
          },
        },
      },
    },
    Outputs: {
      StaticBucketName: {
        Value: `\${self:service}-\${self:provider.stage}-static`,
      },
      CloudFrontDistributionDomain: {
        Value: {
          'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
        },
      },
    },
  },
};
