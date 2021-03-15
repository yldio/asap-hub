interface MailOptions {
  subject?: string;
  body?: string;
}

export const createMailTo = (
  emails: string | string[],
  { subject, body }: MailOptions = {},
): string => {

  const list = typeof emails === 'string' ? new Array(emails) : [...emails];
  const mailTo = convertEmailListToMailToUrl(list);

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

export const convertEmailListToMailToUrl = (list: string[]): URL => {
  const href = list.reduce(
    (a, e, i) => {
      const suffix = i === list.length - 1 ? '' : ',';
      return `${a}${e.split('@').map(encodeURIComponent).join('@')}${suffix}`;
    },
    '',
  );
  return new URL(`mailto:${href}`);
};
