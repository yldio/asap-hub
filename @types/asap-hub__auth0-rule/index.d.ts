declare global {
  const configuration: {
    APP_ORIGIN: string;
    API_SHARED_SECRET: string;
  };
}

export type User = {
  app_metadata: object;
  created_at: unknown;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: object[];
  last_password_reset: unknown;
  multifactor: string[];
  name: string;
  nickname: string;
  permissions: string;
  phone_number?: string;
  phone_verified?: boolean;
  picture: string;
  updated_at: unknown;
  user_id: string;
  user_metadata: object;
  username: string;
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
    tenant_domain: string;
    domain_aliases: string[];
  };
  connectionMetadata: Record<string, string>;
  samlConfiguration?: object;
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
  idToken: Record<string, any>;
  original_protocol?: string;
  multifactor?: object;
  redirect?: object;
  sessionID: string;
  request: {
    userAgent: string;
    ip: string;
    hostname: string;
    query: Record<string, string>;
    body: unknown;
    geoip: {
      country_code: string;
      country_code3: string;
      country_name: string;
      city_name: string;
      latitude: unknown;
      longitude: unknown;
      time_zone: unknown;
      continent_code: string;
    };
  };
  primaryUser: string;
  authentication: {
    methods: {
      name: 'federated' | 'pwd' | 'sms' | 'email' | 'mfa';
      timestamp: number;
    }[];
  };
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
) => void;
