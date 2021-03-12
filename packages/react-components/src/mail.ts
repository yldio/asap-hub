interface MailOptions {
  subject?: string;
  body?: string;
}

export const createMailTo = (
  emails: string | string[],
  { subject, body }: MailOptions = {},
): string => {
  const mailTo =
    typeof emails === 'string'
      ? convertEmailToMailTo(emails)
      : convertEmailListToMailTo(emails);

  if (subject) mailTo.searchParams.set('subject', subject);
  if (body) mailTo.searchParams.set('body', body);

  return mailTo.toString();
};

export const mailToFeedback = (overrides?: MailOptions): string =>
  createMailTo('info@asap.science', {
    subject: 'ASAP Hub: Hub Feedback',
    ...overrides,
  });

export const mailToGrants = (overrides?: MailOptions): string =>
  createMailTo('grants@parkinsonsroadmap.org', {
    subject: 'ASAP Hub: Grant support',
    ...overrides,
  });

export const mailToSupport = (overrides?: MailOptions): string =>
  createMailTo('techsupport@asap.science', {
    subject: 'ASAP Hub: Tech support',
    ...overrides,
  });

export const convertEmailToMailTo = (email: string): URL =>
  new URL(`mailto:${email.split('@').map(encodeURIComponent).join('@')}`);

export const convertEmailListToMailTo = (list: string[]): URL => {
  const href = list.reduce(
    (a, e) => `${a}${e.split('@').map(encodeURIComponent).join('@')},`,
    '',
  );
  return new URL(`mailto:${href}`);
};
