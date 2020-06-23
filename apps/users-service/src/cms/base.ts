import Got from 'got';
import decode from 'jwt-decode';
import {
  cmsBaseUrl,
  cmsAppName,
  cmsClientId,
  cmsClientSecret,
} from '../config';

interface JwtToken {
  exp: number;
}

export default class Base<T> {
  client: typeof Got;

  cmsAPIToken: string;

  constructor() {
    this.cmsAPIToken = '';
    this.client = Got.extend({
      prefixUrl: `${cmsBaseUrl}/api/content/${cmsAppName}/`,
      hooks: {
        beforeRequest: [
          async (options): Promise<void> => {
            if (!this.isTokenValid()) {
              await this.generateCMSToken();
            }

            /* eslint-disable no-param-reassign */
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${this.cmsAPIToken}`,
            };
          },
        ],
      },
    });
  }

  isTokenValid(): boolean {
    if (!this.cmsAPIToken) return false;

    const jwt = decode<JwtToken>(this.cmsAPIToken);
    const currentTime = Date.now() / 1000;

    return currentTime < jwt.exp;
  }

  async generateCMSToken(): Promise<void> {
    /* eslint-disable @typescript-eslint/camelcase */
    const { access_token: accessToken } = await Got.post(
      `${cmsBaseUrl}/identity-server/connect/token`,
      {
        form: {
          grant_type: 'client_credentials',
          scope: 'squidex-api',
          client_id: cmsClientId,
          client_secret: cmsClientSecret,
        },
      },
    ).json();

    this.cmsAPIToken = accessToken;
  }
}
