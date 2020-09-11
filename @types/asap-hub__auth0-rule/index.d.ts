declare global {
  const configuration: {
    APP_ORIGIN: string;
    API_SHARED_SECRET: string;
  };
}

export type User = {
  created_at: unknown;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: object[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: unknown;
  user_id: string;
  locale: string;
  [customClaimName: string]: unknown;
};

export type RuleContext<CustomContext extends object = {}> = Partial<
  CustomContext
> & {
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
  samlConfiguration?: object;
  request: {
    query: Record<string, string>;
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
  sso?: object;
  accessToken: Record<string, any>;
  idToken: User;
  sessionID: string;
  authorization: {
    roles: string[];
  };
};

export interface RuleCallback<CustomContext extends object = {}> {
  (error: Error): void;
  (error: null, user: User, context: RuleContext<CustomContext>): void;
}

export type Rule<CustomContext extends object = {}> = (
  user: User,
  context: RuleContext<CustomContext>,
  callback: RuleCallback<CustomContext>,
) => void | Promise<void>;
