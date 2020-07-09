import Got from 'got';
import decode from 'jwt-decode';

interface JwtToken {
  exp: number;
}

export interface BaseOptions {
  baseUrl: string;
  appName: string;
  clientId: string;
  clientSecret: string;
}

export class Base {
  client: typeof Got;
  APIToken: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;

  constructor({
    baseUrl,
    appName,
    clientId,
    clientSecret,
  }: {
    baseUrl: string;
    appName: string;
    clientId: string;
    clientSecret: string;
  }) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.APIToken = '';

    this.client = Got.extend({
      prefixUrl: `${baseUrl}/api/content/${appName}/`,
      hooks: {
        beforeRequest: [
          async (options): Promise<void> => {
            if (!this.isTokenValid()) {
              await this.generateCMSToken();
            }

            /* eslint-disable no-param-reassign */
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${this.APIToken}`,
            };
          },
        ],
      },
    });
  }

  isTokenValid(): boolean {
    if (!this.APIToken) return false;

    const jwt = decode<JwtToken>(this.APIToken);
    const currentTime = Date.now() / 1000;

    return currentTime < jwt.exp;
  }

  async generateCMSToken(): Promise<void> {
    /* eslint-disable @typescript-eslint/camelcase */
    const { access_token: accessToken } = await Got.post(
      `${this.baseUrl}/identity-server/connect/token`,
      {
        form: {
          grant_type: 'client_credentials',
          scope: 'squidex-api',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      },
    ).json();

    this.APIToken = accessToken;
  }
}
