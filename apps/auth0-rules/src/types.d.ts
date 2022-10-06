declare global {
  const configuration: {
    APP_ORIGIN: string;
    APP_DOMAIN: string;
    API_SHARED_SECRET: string;
  };
  class UnauthorizedError extends Error {}
}

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

export type RuleContext<
  CustomContext extends Record<string, unknown> = Record<string, unknown>,
> = Partial<CustomContext> & {
  tenant: string;
  clientID: string;
  clientName: string;
  clientMetadata: Record<string, string>;
  connectionID: string;
  connection: string;
  connectionStrategy: string;
  connectionOptions: {
    tenant_domain?: string;
    domain_aliases?: string[];
  };
  connectionMetadata: Record<string, string>;
  samlConfiguration?: Record<string, unknown>;
  request: {
    query: Record<string, string>;
    body: {
      redirect_uri?: string;
    };
  };
  protocol:
    | 'oidc-basic-profile'
    | 'oidc-implicit-profile'
    | 'oauth2-device-code'
    | 'oauth2-resource-owner'
    | 'oauth2-resource-owner-jwt-bearer'
    | 'oauth2-password'
    | 'oauth2-refresh-token'
    | 'samlp'
    | 'wsfed'
    | 'wstrust-usernamemixed'
    | 'delegation'
    | 'redirect-callback';
  stats: Record<string, number>;
  sso?: Record<string, unknown>;
  accessToken: Record<string, unknown>;
  idToken: User;
  sessionID: string;
  authorization: {
    roles: string[];
  };
};

export interface RuleCallback<
  CustomContext extends Record<string, unknown> = Record<string, unknown>,
> {
  (error: Error): void;
  (error: null, user: User, context: RuleContext<CustomContext>): void;
}

export type Rule<
  CustomContext extends Record<string, unknown> = Record<string, unknown>,
> = (
  user: User,
  context: RuleContext<CustomContext>,
  callback: RuleCallback<CustomContext>,
) => void | Promise<void>;
