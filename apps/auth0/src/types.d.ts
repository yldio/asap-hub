import { Auth0PostLoginEvent } from '@vedicium/auth0-actions-sdk';

export type User = {
  created_at: unknown;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: Record<string, unknown>[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: unknown;
  user_id: string;
  locale: string;
  [customClaimName: string]: unknown;
};

// Extended Action Types

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type Auth0Secrets = {
  secrets: {
    BASE_PR_APP_DOMAIN: string; // hub.asap.science / gp2.asap.science
    API_URL: string; // https://api-dev.hub.asap.science / https://api-dev.gp2.asap.science
    AUTH0_SHARED_SECRET: string;
    AUTH0_ADDITIONAL_CLAIM_DOMAIN?: string; // 'https://dev.hub.asap.science' / https://dev.gp2.asap.science in development to allow local login
  };
};

export type Auth0PostLoginEventWithSecrets = Auth0PostLoginEvent & Auth0Secrets;
