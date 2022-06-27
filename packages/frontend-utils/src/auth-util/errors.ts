import { Auth0Error } from 'auth0-js';
import { format } from 'util';

export interface Auth0Rule {
  readonly message: string;
  readonly format?: unknown[];
  readonly verified: boolean;
  readonly items?: ReadonlyArray<{
    readonly message: string;
    readonly format?: unknown[];
    readonly verified: boolean;
  }>;
}

type Auth0RuleDescription = { rules: ReadonlyArray<Auth0Rule> };
// Auth0 errors are actually more complex than the typings claim
export type WebAuthError = Auth0Error & {
  readonly description?: null | string | Auth0RuleDescription;
};

const isRulesDescription = (
  description: string | Auth0RuleDescription,
): description is Auth0RuleDescription => typeof description !== 'string';

export interface ErrorMessage {
  readonly text: string;
  readonly target?: 'email' | 'password';
}

const knownErrorCodeTexts: Record<string, ErrorMessage['text']> = {
  invalid_signup:
    'Signup failed. Perhaps an account with this username already exists.',
  invalid_user_password:
    'Your e-mail or password is incorrect. Ensure this is the log in method you used to set up your account.',
};
const knownErrorCodeTargets: Record<string, ErrorMessage['target']> = {
  invalid_signup: 'email', // This code is generic really, but we expect it to most commonly be an existing email conflict
  invalid_password: 'password',
};

// Auth0 API has very inconsistent error formats
const extractRuleErrorMessage = (rules: ReadonlyArray<Auth0Rule>): string =>
  rules
    .filter(({ verified }) => !verified)
    .flatMap(
      ({ message: ruleMessage, format: ruleFormat = [], items = [] }) => [
        format(ruleMessage, ...ruleFormat),
        ...items.map(
          ({ message: itemMessage, format: itemFormat = [], verified }) =>
            `${verified ? '✔' : '✖'} ${format(itemMessage, ...itemFormat)}`,
        ),
      ],
    )
    .join('\n');

export const extractErrorMessage = (
  error: WebAuthError | Error,
): ErrorMessage => ({
  text:
    ('code' in error && error.code && knownErrorCodeTexts[error.code]) ||
    ('error_description' in error && error.error_description) ||
    ('errorDescription' in error && error.errorDescription) ||
    ('description' in error &&
      error.description &&
      (isRulesDescription(error.description)
        ? extractRuleErrorMessage(error.description.rules)
        : error.description)) ||
    ('message' in error &&
      error.message &&
      `Unknown authentication error: ${error.message}`) ||
    `Unknown authentication error: ${error.name}`,
  target:
    'code' in error && error.code
      ? knownErrorCodeTargets[error.code]
      : undefined,
});
