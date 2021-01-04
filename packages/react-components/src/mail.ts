interface MailOptions {
  subject?: string;
  body?: string;
}

export const createMailTo = (
  email: string,
  { subject, body }: MailOptions = {},
): string => {
  const mailTo = new URL(
    `mailto:${email.split('@').map(encodeURIComponent).join('@')}`,
  );

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
