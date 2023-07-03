interface MailOptions {
  subject?: string;
  body?: string;
}

export const TECH_SUPPORT_EMAIL = 'techsupport@asap.science';
export const GRANTS_EMAIL = 'grants@parkinsonsroadmap.org';

export const createMailTo = (
  emailOrList: string | string[],
  { subject, body }: MailOptions = {},
): string => {
  const emails = typeof emailOrList === 'string' ? [emailOrList] : emailOrList;
  const mailTo = new URL(
    `mailto:${emails
      .map((email) => email.split('@').map(encodeURIComponent).join('@'))
      .join(',')}`,
  );
  const params = [
    subject ? `subject=${encodeURIComponent(subject)}` : '',
    body ? `body=${encodeURIComponent(body)}` : '',
  ]
    .filter(Boolean)
    .join('&');

  return `${mailTo.toString()}${params ? `?${params}` : ''}`;
};

export const mailToFeedback = (overrides?: MailOptions): string =>
  createMailTo(TECH_SUPPORT_EMAIL, {
    subject: 'ASAP Hub: Hub Feedback',
    ...overrides,
  });

export const mailToGrants = (overrides?: MailOptions): string =>
  createMailTo(GRANTS_EMAIL, {
    subject: 'ASAP Hub: Grant support',
    ...overrides,
  });

export const mailToSupport = (overrides?: MailOptions): string =>
  createMailTo(TECH_SUPPORT_EMAIL, {
    subject: 'ASAP Hub: Tech support',
    ...overrides,
  });
